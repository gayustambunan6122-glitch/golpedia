<?php
function issueToken(string $email): string {
    $cfg = require __DIR__ . '/config.php';
    $payload = base64_encode(json_encode([
        'email' => $email,
        'iat'   => time(),
        'exp'   => time() + 60 * 60 * 24 * 7, // 7 days
    ]));
    $sig = hash_hmac('sha256', $payload, $cfg['session_secret']);
    return $payload . '.' . $sig;
}

function verifyToken(?string $token): ?array {
    if (!$token) return null;
    $cfg = require __DIR__ . '/config.php';
    $parts = explode('.', $token, 2);
    if (count($parts) !== 2) return null;
    [$payload, $sig] = $parts;
    $expected = hash_hmac('sha256', $payload, $cfg['session_secret']);
    if (!hash_equals($expected, $sig)) return null;
    $data = json_decode(base64_decode($payload), true);
    if (!$data || ($data['exp'] ?? 0) < time()) return null;
    if (strcasecmp($data['email'] ?? '', $cfg['admin']['email']) !== 0) return null;
    return $data;
}

function requireAdmin(): array {
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_starts_with($hdr, 'Bearer ') ? substr($hdr, 7) : null;
    $data = verifyToken($token);
    if (!$data) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    return $data;
}
