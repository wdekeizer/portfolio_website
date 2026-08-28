<?php
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/smtp.php';

$config = require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body = read_json_body();
$name = trim($body['name'] ?? '');
$email = trim($body['email'] ?? '');
$message = trim($body['message'] ?? '');

if (
    $name === '' || strlen($name) > 200
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || $message === '' || strlen($message) > 5000
) {
    json_response(['error' => 'Invalid input'], 400);
}

$pdo = get_db();
$id = cuid();
$stmt = $pdo->prepare(
    'INSERT INTO ContactMessage (id, name, email, message, createdAt) VALUES (?, ?, ?, ?, NOW(3))'
);
$stmt->execute([$id, $name, $email, $message]);

try {
    send_gmail_smtp(
        $config['gmail_user'],
        $config['gmail_app_password'],
        $config['contact_to_email'] ?: $config['gmail_user'],
        $email,
        "New portfolio contact from $name",
        "From: $name <$email>\n\n$message"
    );
} catch (Throwable $e) {
    error_log('Failed to send contact notification email: ' . $e->getMessage());
}

json_response(['id' => $id, 'name' => $name, 'email' => $email, 'message' => $message], 201);
