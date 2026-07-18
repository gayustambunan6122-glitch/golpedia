# Kickoff Admin API (PHP + MySQL, cPanel-ready)

Simple front-controller PHP API that backs the `/admin` dashboard. No frameworks, no composer — just drop the folder into your cPanel `public_html`.

## 1. Upload

Copy this whole `api-php/` folder to your cPanel site, e.g. `public_html/api-php/`. Final URL will be `https://your-site.com/api-php/`.

## 2. Create the database

In cPanel → **MySQL Databases** create a database + user, grant ALL privileges, then in **phpMyAdmin** run `database/schema.sql` from the project root.

## 3. Configure

Create `api-php/.env` (same folder as `index.php`):

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpaneluser_kickoff
DB_USER=cpaneluser_kickoff
DB_PASSWORD=your-mysql-password

ADMIN_EMAIL=you@example.com
# Generate: php -r "echo password_hash('yourpassword', PASSWORD_BCRYPT);"
ADMIN_PASSWORD_HASH=$2y$10$....

# 32+ random chars — used to sign login tokens
SESSION_SECRET=change-me-to-a-long-random-string

# Public URL prefix where uploaded cover images will be served from
UPLOADS_URL=https://your-site.com/api-php/uploads
```

Then `chmod 600 api-php/.env` and make sure `api-php/uploads/` is writable (`chmod 755`).

## 4. Point the frontend at it

In your Lovable project (or your built frontend's environment), set:

```
VITE_API_BASE_URL=https://your-site.com/api-php
```

Redeploy the frontend. Visit `/admin`, log in with the email + password above, and you're managing articles against your real MySQL.

## Endpoints

| Method | Path              | Auth  | Purpose                    |
|--------|-------------------|-------|----------------------------|
| POST   | `/login`          | —     | Get admin token            |
| GET    | `/me`             | Admin | Verify token               |
| GET    | `/categories`     | —     | List categories            |
| POST   | `/categories`     | Admin | Create category            |
| GET    | `/articles`       | —     | List articles (newest 200) |
| POST   | `/articles`       | Admin | Create article             |
| GET    | `/articles/{id}`  | —     | Read one                   |
| PUT    | `/articles/{id}`  | Admin | Update                     |
| DELETE | `/articles/{id}`  | Admin | Delete                     |
| POST   | `/upload`         | Admin | Upload cover image (5MB)   |

Auth: send `Authorization: Bearer <token>` from the `/login` response.
