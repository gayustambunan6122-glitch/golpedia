-- ============================================================
--  Kickoff — cPanel MySQL schema
--  Run this in phpMyAdmin (cPanel → Databases → phpMyAdmin)
--  after creating the database and user in "MySQL Databases".
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ---------- categories ----------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(80)  NOT NULL,
  `slug`       VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- articles ----------
CREATE TABLE IF NOT EXISTS `articles` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id`      INT UNSIGNED NULL,
  `title`            VARCHAR(200) NOT NULL,
  `slug`             VARCHAR(220) NOT NULL,
  `summary`          VARCHAR(500) NOT NULL,
  `content`          MEDIUMTEXT   NOT NULL,
  `cover_image`      VARCHAR(500) NULL,
  `tag`              VARCHAR(50)  NULL,           -- e.g. #TransferRumor
  `views_count`      INT UNSIGNED NOT NULL DEFAULT 0,
  `reactions_count`  INT UNSIGNED NOT NULL DEFAULT 0,
  `comments_count`   INT UNSIGNED NOT NULL DEFAULT 0,
  `is_published`     TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_articles_slug` (`slug`),
  KEY `ix_articles_created` (`created_at`),
  KEY `ix_articles_category` (`category_id`),
  CONSTRAINT `fk_articles_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- reactions (optional, for per-user Hyped tracking) ----------
CREATE TABLE IF NOT EXISTS `reactions` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` BIGINT UNSIGNED NOT NULL,
  `visitor_id` VARCHAR(64) NOT NULL,   -- cookie / device id
  `type`       ENUM('hyped','fire','cold') NOT NULL DEFAULT 'hyped',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reaction_once` (`article_id`,`visitor_id`,`type`),
  CONSTRAINT `fk_reactions_article`
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- comments ----------
CREATE TABLE IF NOT EXISTS `comments` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` BIGINT UNSIGNED NOT NULL,
  `author`     VARCHAR(60)  NOT NULL DEFAULT 'guest',
  `body`       VARCHAR(1000) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_comments_article` (`article_id`),
  CONSTRAINT `fk_comments_article`
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- seed ----------
INSERT INTO `categories` (`name`, `slug`) VALUES
  ('Premier League', 'premier-league'),
  ('La Liga',        'la-liga'),
  ('Serie A',        'serie-a'),
  ('Champions League','ucl'),
  ('Transfer Rumors','transfers'),
  ('Culture',        'culture')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
