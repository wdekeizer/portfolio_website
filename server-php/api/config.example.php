<?php
return [
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'your_db_name',
        'user' => 'your_db_user',
        'pass' => 'your_db_password',
    ],
    'admin_token' => 'generate-with: openssl rand -hex 24',
    'gmail_user' => 'you@gmail.com',
    'gmail_app_password' => '16-character app password from Google Account > Security > App Passwords',
    'contact_to_email' => 'you@gmail.com',
];
