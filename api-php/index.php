<?php
// Kickoff admin API — front controller.
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';

$cfg    = require __DIR__ . '/config.php';
$method = $_SERVER['REQUEST_METHOD'];
$path   = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '', '/');
// Strip whatever prefix the folder lives under (e.g. api-php/).
$path   = preg_replace('#^api-php/?#', '', $path) ?? '';
$parts  = $path === '' ? [] : explode('/', $path);

function body(): array {
    $raw = file_get_contents('php://input') ?: '';
    $d = json_decode($raw, true);
    return is_array($d) ? $d : [];
}
function slugify(string $s): string {
    $s = strtolower(trim($s));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
    return trim($s, '-') ?: bin2hex(random_bytes(4));
}

try {
    // ---------- POST /login ----------
    if ($parts === ['login'] && $method === 'POST') {
        $b = body();
        $email = trim($b['email'] ?? '');
        $pw    = (string)($b['password'] ?? '');
        if (
            strcasecmp($email, $cfg['admin']['email']) !== 0 ||
            !password_verify($pw, $cfg['admin']['password_hash'])
        ) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            exit;
        }
        echo json_encode(['token' => issueToken($email), 'email' => $email]);
        exit;
    }

    // ---------- GET /me ----------
    if ($parts === ['me'] && $method === 'GET') {
        $u = requireAdmin();
        echo json_encode(['email' => $u['email']]);
        exit;
    }

    // ---------- /categories ----------
    if ($parts === ['categories']) {
        if ($method === 'GET') {
            echo json_encode(db()->query('SELECT id, name, slug FROM categories ORDER BY name')->fetchAll());
            exit;
        }
        if ($method === 'POST') {
            requireAdmin();
            $b = body();
            $name = trim($b['name'] ?? '');
            if ($name === '') { http_response_code(400); echo json_encode(['error' => 'name required']); exit; }
            $slug = slugify($b['slug'] ?? $name);
            $stmt = db()->prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
            $stmt->execute([$name, $slug]);
            echo json_encode(['id' => (int) db()->lastInsertId(), 'name' => $name, 'slug' => $slug]);
            exit;
        }
    }

    // ---------- /articles ----------
    if ($parts === ['articles']) {
        if ($method === 'GET') {
            $stmt = db()->query(
                'SELECT a.*, c.name AS category_name
                 FROM articles a LEFT JOIN categories c ON c.id = a.category_id
                 ORDER BY a.created_at DESC LIMIT 200'
            );
            echo json_encode($stmt->fetchAll());
            exit;
        }
        if ($method === 'POST') {
            requireAdmin();
            $b = body();
            $title = trim($b['title'] ?? '');
            $summary = trim($b['summary'] ?? '');
            $content = (string)($b['content'] ?? '');
            if ($title === '' || $summary === '' || $content === '') {
                http_response_code(400); echo json_encode(['error' => 'title, summary, content required']); exit;
            }
            $slug = slugify($b['slug'] ?? $title);
            $stmt = db()->prepare(
                'INSERT INTO articles (category_id, title, slug, summary, content, cover_image, tag, is_published)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $b['category_id'] ?: null,
                $title, $slug, $summary, $content,
                $b['cover_image'] ?: null,
                $b['tag'] ?: null,
                (int)(bool)($b['is_published'] ?? 1),
            ]);
            echo json_encode(['id' => (int) db()->lastInsertId(), 'slug' => $slug]);
            exit;
        }
    }

    // ---------- /articles/{id}  (GET, PUT, DELETE) ----------
    if (count($parts) === 2 && $parts[0] === 'articles' && ctype_digit($parts[1])) {
        $id = (int) $parts[1];
        if ($method === 'GET') {
            $stmt = db()->prepare('SELECT * FROM articles WHERE id = ?');
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) { http_response_code(404); echo json_encode(['error' => 'Not found']); exit; }
            echo json_encode($row);
            exit;
        }
        if ($method === 'PUT') {
            requireAdmin();
            $b = body();
            $fields = [];
            $vals   = [];
            foreach (['category_id','title','slug','summary','content','cover_image','tag','is_published'] as $f) {
                if (array_key_exists($f, $b)) { $fields[] = "$f = ?"; $vals[] = $b[$f] === '' ? null : $b[$f]; }
            }
            if (!$fields) { echo json_encode(['ok' => true]); exit; }
            $vals[] = $id;
            $sql = 'UPDATE articles SET ' . implode(', ', $fields) . ' WHERE id = ?';
            db()->prepare($sql)->execute($vals);
            echo json_encode(['ok' => true]);
            exit;
        }
        if ($method === 'DELETE') {
            requireAdmin();
            db()->prepare('DELETE FROM articles WHERE id = ?')->execute([$id]);
            echo json_encode(['ok' => true]);
            exit;
        }
    }

    // ---------- POST /upload  (multipart cover image) ----------
    if ($parts === ['upload'] && $method === 'POST') {
        requireAdmin();
        if (empty($_FILES['file'])) { http_response_code(400); echo json_encode(['error' => 'file required']); exit; }
        $f = $_FILES['file'];
        $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
        $mime = mime_content_type($f['tmp_name']) ?: '';
        if (!isset($allowed[$mime])) { http_response_code(415); echo json_encode(['error' => 'Unsupported image type']); exit; }
        if ($f['size'] > 5 * 1024 * 1024) { http_response_code(413); echo json_encode(['error' => 'Max 5MB']); exit; }
        $dir = __DIR__ . '/uploads';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $name = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $allowed[$mime];
        move_uploaded_file($f['tmp_name'], "$dir/$name");
        echo json_encode(['url' => rtrim($cfg['uploads_url'], '/') . '/' . $name]);
        exit;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Not found', 'path' => $path]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error', 'detail' => $e->getMessage()]);
}
