<?php
/**
 * Database configuration
 * Using SQLite for simplicity
 */

/**
 * Get database connection
 * @return PDO Database connection object
 */
function getDbConnection() {
    try {
        // Database file path
        $dbPath = __DIR__ . '/../../db/calendar.sqlite';

        // Create directory if it doesn't exist
        $dbDir = dirname($dbPath);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0777, true);
        }

        // Create PDO instance for SQLite
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        // Check if the tasks table exists, create if it doesn't
        createTablesIfNotExist($pdo);

        return $pdo;
    } catch (PDOException $e) {
        error_log('Database connection error: ' . $e->getMessage());
        return null;
    }
}

/**
 * Create necessary tables if they don't exist
 * @param PDO $pdo Database connection
 */
function createTablesIfNotExist($pdo) {
    $pdo->exec('
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            task_date TEXT NOT NULL,
            task_time TEXT,
            end_time TEXT,
            user_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ');
}

/**
 * Helper function to send API responses
 * @param int $status HTTP status code
 * @param mixed $data Response data
 */
function sendResponse($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}
