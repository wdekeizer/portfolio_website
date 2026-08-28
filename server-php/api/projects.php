<?php
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';

$config = require __DIR__ . '/config.php';
$pdo = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id) {
    $stmt = $pdo->query('SELECT * FROM Project ORDER BY featured DESC, createdAt DESC');
    $rows = array_map('format_project', $stmt->fetchAll());
    json_response($rows);
}

if ($method === 'POST') {
    require_admin($config);
    $body = read_json_body();
    $title = trim($body['title'] ?? '');
    $description = trim($body['description'] ?? '');
    if ($title === '' || strlen($title) > 200 || $description === '' || strlen($description) > 2000) {
        json_response(['error' => 'title and description are required'], 400);
    }
    $newId = cuid();
    $stmt = $pdo->prepare(
        'INSERT INTO Project (id, title, description, repoUrl, liveUrl, tags, featured, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))'
    );
    $stmt->execute([
        $newId,
        $title,
        $description,
        $body['repoUrl'] ?? null,
        $body['liveUrl'] ?? null,
        json_encode($body['tags'] ?? []),
        !empty($body['featured']) ? 1 : 0,
    ]);
    $stmt = $pdo->prepare('SELECT * FROM Project WHERE id = ?');
    $stmt->execute([$newId]);
    json_response(format_project($stmt->fetch()), 201);
}

if ($method === 'PATCH' && $id) {
    require_admin($config);
    $body = read_json_body();
    $fields = [];
    $values = [];
    foreach (['title', 'description', 'repoUrl', 'liveUrl'] as $f) {
        if (array_key_exists($f, $body)) {
            $fields[] = "$f = ?";
            $values[] = $body[$f];
        }
    }
    if (array_key_exists('tags', $body)) {
        $fields[] = 'tags = ?';
        $values[] = json_encode($body['tags']);
    }
    if (array_key_exists('featured', $body)) {
        $fields[] = 'featured = ?';
        $values[] = !empty($body['featured']) ? 1 : 0;
    }
    $check = $pdo->prepare('SELECT id FROM Project WHERE id = ?');
    $check->execute([$id]);
    if (!$check->fetch()) {
        json_response(['error' => 'Project not found'], 404);
    }
    if (!empty($fields)) {
        $fields[] = 'updatedAt = NOW(3)';
        $values[] = $id;
        $stmt = $pdo->prepare('UPDATE Project SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($values);
    }
    $stmt = $pdo->prepare('SELECT * FROM Project WHERE id = ?');
    $stmt->execute([$id]);
    json_response(format_project($stmt->fetch()));
}

if ($method === 'DELETE' && $id) {
    require_admin($config);
    $stmt = $pdo->prepare('DELETE FROM Project WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        json_response(['error' => 'Project not found'], 404);
    }
    http_response_code(204);
    exit;
}

json_response(['error' => 'Not found'], 404);
