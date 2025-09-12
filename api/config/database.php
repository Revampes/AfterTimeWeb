<?php
/**
 * Database configuration
 */

// Database connection parameters
$db_config = [
    'host' => 'localhost',
    'username' => 'your_db_username',
    'password' => 'your_db_password',
    'database' => 'aftertime_calendar',
    'charset' => 'utf8mb4'
];

/**
 * Get database connection
 * @return PDO Database connection object
 */
function getDbConnection() {
    global $db_config;

    try {
        // Create PDO instance
        $dsn = "mysql:host={$db_config['host']};dbname={$db_config['database']};charset={$db_config['charset']}";
        $pdo = new PDO($dsn, $db_config['username'], $db_config['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return $pdo;
    } catch (PDOException $e) {
        // Log error and return false
        error_log('Database connection failed: ' . $e->getMessage());
        return false;
    }
}
