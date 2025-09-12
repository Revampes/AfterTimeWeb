<?php
/**
 * Tasks API endpoint
 * Handles CRUD operations for calendar tasks
 */

// Set headers for JSON API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database connection
require_once __DIR__ . '/config/database.php';

// Get database connection
$db = getDbConnection();
if (!$db) {
    sendResponse(500, ['error' => 'Database connection failed']);
    exit;
}

// Route the request based on HTTP method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getTasks();
        break;
    case 'POST':
        createTask();
        break;
    case 'PUT':
        updateTask();
        break;
    case 'DELETE':
        deleteTask();
        break;
    default:
        sendResponse(405, ['error' => 'Method not allowed']);
        break;
}

/**
 * Get tasks - supports filtering by date or date range
 */
function getTasks() {
    global $db;

    try {
        // Check if specific task ID is requested
        if (isset($_GET['id'])) {
            $taskId = (int)$_GET['id'];
            $stmt = $db->prepare("SELECT * FROM tasks WHERE id = ?");
            $stmt->execute([$taskId]);
            $task = $stmt->fetch();

            if ($task) {
                sendResponse(200, $task);
            } else {
                sendResponse(404, ['error' => 'Task not found']);
            }
            return;
        }

        // Get tasks for a specific date
        if (isset($_GET['date'])) {
            $date = $_GET['date'];
            $stmt = $db->prepare("SELECT * FROM tasks WHERE task_date = ? ORDER BY task_time");
            $stmt->execute([$date]);
            $tasks = $stmt->fetchAll();
            sendResponse(200, $tasks);
            return;
        }

        // Get tasks for a date range
        if (isset($_GET['start_date']) && isset($_GET['end_date'])) {
            $startDate = $_GET['start_date'];
            $endDate = $_GET['end_date'];
            $stmt = $db->prepare("SELECT * FROM tasks WHERE task_date BETWEEN ? AND ? ORDER BY task_date, task_time");
            $stmt->execute([$startDate, $endDate]);
            $tasks = $stmt->fetchAll();
            sendResponse(200, $tasks);
            return;
        }

        // Get task counts by date for calendar display
        if (isset($_GET['counts']) && isset($_GET['year']) && isset($_GET['month'])) {
            $year = (int)$_GET['year'];
            $month = (int)$_GET['month'];

            // First day of month
            $startDate = sprintf("%04d-%02d-01", $year, $month);

            // Last day of month
            $lastDay = date('t', strtotime($startDate));
            $endDate = sprintf("%04d-%02d-%02d", $year, $month, $lastDay);

            $stmt = $db->prepare("
                SELECT task_date, COUNT(*) as count
                FROM tasks
                WHERE task_date BETWEEN ? AND ?
                GROUP BY task_date
            ");
            $stmt->execute([$startDate, $endDate]);
            $counts = $stmt->fetchAll();

            // Convert to associative array with date as key
            $result = [];
            foreach ($counts as $count) {
                $result[$count['task_date']] = (int)$count['count'];
            }

            sendResponse(200, $result);
            return;
        }

        // Default: Get all tasks (with optional pagination)
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $offset = ($page - 1) * $limit;

        $stmt = $db->prepare("SELECT * FROM tasks ORDER BY task_date DESC, task_time DESC LIMIT ? OFFSET ?");
        $stmt->execute([$limit, $offset]);
        $tasks = $stmt->fetchAll();

        sendResponse(200, $tasks);

    } catch (Exception $e) {
        error_log('Error getting tasks: ' . $e->getMessage());
        sendResponse(500, ['error' => 'Failed to retrieve tasks']);
    }
}

/**
 * Create a new task
 */
function createTask() {
    global $db;

    try {
        // Get request body
        $data = json_decode(file_get_contents('php://input'), true);

        // Validate required fields
        if (empty($data['title']) || empty($data['task_date'])) {
            sendResponse(400, ['error' => 'Title and date are required']);
            return;
        }

        // Prepare SQL statement
        $stmt = $db->prepare("
            INSERT INTO tasks (title, description, task_date, task_time, user_id)
            VALUES (?, ?, ?, ?, ?)
        ");

        // Execute with data
        $stmt->execute([
            $data['title'],
            $data['description'] ?? null,
            $data['task_date'],
            $data['task_time'] ?? null,
            $data['user_id'] ?? null
        ]);

        // Get the inserted ID
        $taskId = $db->lastInsertId();

        // Return the created task
        $stmt = $db->prepare("SELECT * FROM tasks WHERE id = ?");
        $stmt->execute([$taskId]);
        $task = $stmt->fetch();

        sendResponse(201, $task);

    } catch (Exception $e) {
        error_log('Error creating task: ' . $e->getMessage());
        sendResponse(500, ['error' => 'Failed to create task']);
    }
}

/**
 * Update an existing task
 */
function updateTask() {
    global $db;

    try {
        // Get request body
        $data = json_decode(file_get_contents('php://input'), true);

        // Check if task ID is provided
        if (empty($data['id'])) {
            sendResponse(400, ['error' => 'Task ID is required']);
            return;
        }

        $taskId = (int)$data['id'];

        // Check if task exists
        $stmt = $db->prepare("SELECT id FROM tasks WHERE id = ?");
        $stmt->execute([$taskId]);
        if (!$stmt->fetch()) {
            sendResponse(404, ['error' => 'Task not found']);
            return;
        }

        // Build update statement based on provided fields
        $fields = [];
        $params = [];

        if (isset($data['title'])) {
            $fields[] = "title = ?";
            $params[] = $data['title'];
        }

        if (isset($data['description'])) {
            $fields[] = "description = ?";
            $params[] = $data['description'];
        }

        if (isset($data['task_date'])) {
            $fields[] = "task_date = ?";
            $params[] = $data['task_date'];
        }

        if (isset($data['task_time'])) {
            $fields[] = "task_time = ?";
            $params[] = $data['task_time'];
        }


            $fields[] = "end_time = ?";
            $params[] = $data['end_time'];
        }
        // If no fields to update

        if (empty($fields)) {
            sendResponse(400, ['error' => 'No fields to update']);
            return;
        }

        // Add task ID to params array
        $params[] = $taskId;

        // Prepare and execute update statement
        $sql = "UPDATE tasks SET " . implode(", ", $fields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        // Get updated task
        $stmt = $db->prepare("SELECT * FROM tasks WHERE id = ?");
        $stmt->execute([$taskId]);
        $task = $stmt->fetch();

        sendResponse(200, $task);

    } catch (Exception $e) {
        error_log('Error updating task: ' . $e->getMessage());
        sendResponse(500, ['error' => 'Failed to update task']);
}
    }

/**
 * Delete a task
 */
function deleteTask() {
    global $db;

    try {
        // Get request body
        $data = json_decode(file_get_contents('php://input'), true);

        // Check if task ID is provided
        if (empty($data['id'])) {
            sendResponse(400, ['error' => 'Task ID is required']);
            return;
        }

        $taskId = (int)$data['id'];

        // Check if task exists
        $stmt = $db->prepare("SELECT id FROM tasks WHERE id = ?");
        $stmt->execute([$taskId]);
        if (!$stmt->fetch()) {
            sendResponse(404, ['error' => 'Task not found']);
            return;
        }

        // Delete the task
        $stmt = $db->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->execute([$taskId]);

        sendResponse(200, ['message' => 'Task deleted successfully']);

    } catch (Exception $e) {
        error_log('Error deleting task: ' . $e->getMessage());
        sendResponse(500, ['error' => 'Failed to delete task']);
    }
}

/**
