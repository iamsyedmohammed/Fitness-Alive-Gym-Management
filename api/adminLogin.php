<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set CORS headers first, before any output
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start output buffering to catch any errors
ob_start();

try {
    // Check if config.php exists
    if (!file_exists(__DIR__ . '/config.php')) {
        throw new Exception('config.php file not found');
    }
    
    require_once __DIR__ . '/config.php';
    
    // Check if required functions exist
    if (!function_exists('getDBConnection')) {
        throw new Exception('getDBConnection function not found in config.php');
    }
    
    if (!function_exists('sendError')) {
        throw new Exception('sendError function not found in config.php');
    }
    
    if (!function_exists('sendResponse')) {
        throw new Exception('sendResponse function not found in config.php');
    }
    
    // Start session
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Clear any output that might have been generated
    ob_end_clean();
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'error' => 'Configuration error',
        'message' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ]);
    exit();
} catch (Error $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'error' => 'Fatal error',
        'message' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            sendError('Invalid JSON data: ' . json_last_error_msg(), 400);
        }
        
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $location = $input['location'] ?? 'yakutpura';

        if (empty($email) || empty($password)) {
            sendError('Email and password are required', 400);
        }
        
        // Validate location
        if (!in_array($location, ['yakutpura', 'madanapet'])) {
            $location = 'yakutpura';
        }

        $conn = getDBConnection();
        
        if (!$conn) {
            // Try to get more specific error
            $testConn = @new mysqli(DB_HOST, DB_USER, DB_PASS);
            $errorMsg = 'Database connection failed. ';
            if ($testConn->connect_error) {
                $errorMsg .= 'MySQL Error: ' . $testConn->connect_error . '. ';
            }
            $errorMsg .= 'Please check:\n1. Database credentials in config.php\n2. Database "' . DB_NAME . '" exists in Hostinger\n3. User "' . DB_USER . '" has proper permissions\n4. Database host is correct (usually "localhost" for Hostinger)';
            sendError($errorMsg, 500);
        }
        
        $stmt = $conn->prepare("SELECT id, email, password_hash FROM admin_accounts WHERE email = ?");
        
        if (!$stmt) {
            sendError('Database query preparation failed: ' . $conn->error, 500);
        }
        
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $stmt->close();
            $conn->close();
            sendError('Invalid email or password', 401);
        }

        $admin = $result->fetch_assoc();
        $stmt->close();

        if (!password_verify($password, $admin['password_hash'])) {
            $conn->close();
            sendError('Invalid email or password', 401);
        }

        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['location'] = $location;
        $token = bin2hex(random_bytes(32));
        
        $stmt = $conn->prepare("UPDATE admin_accounts SET session_token = ? WHERE id = ?");
        
        if (!$stmt) {
            $conn->close();
            sendError('Database query preparation failed: ' . $conn->error, 500);
        }
        
        $stmt->bind_param("si", $token, $admin['id']);
        $stmt->execute();
        $stmt->close();
        $conn->close();

        sendResponse([
            'success' => true,
            'token' => $token,
            'admin_id' => $admin['id'],
            'location' => $location
        ]);
    } catch (Exception $e) {
        sendError('Login failed: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

