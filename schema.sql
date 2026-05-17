-- ============================================
-- TaskFlow Dashboard — Schéma MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS taskflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskflow;

-- Table users
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table tasks
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,   -- Soft delete
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Si tu as déjà créé la table, exécute juste cette ligne :
-- ALTER TABLE tasks ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;
