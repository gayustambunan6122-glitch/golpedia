<?php
// ============================================================
//  Kickoff API — configuration
//  Copy config.example.php to config.php and fill in real values,
//  OR export the same names as environment variables in cPanel.
// ============================================================

// Try loading a local .env-style file first (optional).
$envFile = __DIR__ . '/.env';
if (is_readable($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$k, $v] = array_pad(explode('=', $line, 2), 2, '');
        $_ENV[trim($k)] = trim($v, " \t\"'");
    }
}

function env(string $key, ?string $default = null): ?string {
    return $_ENV[$key] ?? getenv($key) ?: $default;
}

return [
    'db' => [
        'host' => env('DB_HOST', 'localhost'),
        'port' => (int) env('DB_PORT', '3306'),
        'name' => env('DB_NAME', ''),
        'user' => env('DB_USER', ''),
        'pass' => env('DB_PASSWORD', ''),
    ],
    'admin' => [
        // Only this email can log in.
        'email' => env('ADMIN_EMAIL', 'admin@example.com'),
        // Generate with:  php -r "echo password_hash('yourpassword', PASSWORD_BCRYPT);"
        'password_hash' => env('ADMIN_PASSWORD_HASH', ''),
    ],
    // 32+ char random string. Used to sign session tokens.
    'session_secret' => env('SESSION_SECRET', ''),
    // Absolute URL prefix returned in cover_image after upload.
    'uploads_url' => env('UPLOADS_URL', '/api-php/uploads'),
];
