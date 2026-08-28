<?php

function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function require_admin(array $config): void
{
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = preg_replace('/^Bearer\s+/i', '', $auth);
    if (!hash_equals($config['admin_token'], (string)$token)) {
        json_response(['error' => 'Unauthorized'], 401);
    }
}

function cuid(): string
{
    return 'c' . bin2hex(random_bytes(12));
}

function format_project(array $row): array
{
    $row['tags'] = json_decode($row['tags'], true) ?? [];
    $row['featured'] = (bool)$row['featured'];
    return $row;
}
