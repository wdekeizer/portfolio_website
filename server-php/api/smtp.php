<?php

function smtp_expect($fp, $codes): string
{
    $codes = (array)$codes;
    $line = '';
    do {
        $line = fgets($fp, 515);
        if ($line === false) {
            throw new RuntimeException('SMTP: connection closed unexpectedly');
        }
    } while (isset($line[3]) && $line[3] === '-');
    $code = (int)substr($line, 0, 3);
    if (!in_array($code, $codes, true)) {
        throw new RuntimeException("SMTP error: $line");
    }
    return $line;
}

function smtp_command($fp, string $cmd, $expectCodes): string
{
    fwrite($fp, $cmd . "\r\n");
    return smtp_expect($fp, $expectCodes);
}

function send_gmail_smtp(
    string $gmailUser,
    string $gmailAppPassword,
    string $to,
    string $replyTo,
    string $subject,
    string $body
): void {
    $fp = fsockopen('smtp.gmail.com', 587, $errno, $errstr, 15);
    if (!$fp) {
        throw new RuntimeException("SMTP connect failed: $errstr ($errno)");
    }
    stream_set_timeout($fp, 15);

    try {
        smtp_expect($fp, 220);
        smtp_command($fp, 'EHLO localhost', 250);
        smtp_command($fp, 'STARTTLS', 220);

        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new RuntimeException('SMTP: STARTTLS negotiation failed');
        }

        smtp_command($fp, 'EHLO localhost', 250);
        smtp_command($fp, 'AUTH LOGIN', 334);
        smtp_command($fp, base64_encode($gmailUser), 334);
        smtp_command($fp, base64_encode($gmailAppPassword), 235);

        smtp_command($fp, "MAIL FROM:<$gmailUser>", 250);
        smtp_command($fp, "RCPT TO:<$to>", [250, 251]);
        smtp_command($fp, 'DATA', 354);

        $headers = [
            'From: ' . $gmailUser,
            'To: ' . $to,
            'Reply-To: ' . $replyTo,
            'Subject: ' . $subject,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
        ];
        $data = implode("\r\n", $headers) . "\r\n\r\n" . str_replace("\n", "\r\n", $body) . "\r\n.";
        smtp_command($fp, $data, 250);

        smtp_command($fp, 'QUIT', 221);
    } finally {
        fclose($fp);
    }
}
