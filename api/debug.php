<?php
// Debug script to check PHP configuration and errors
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$debug = [
    'php_version' => phpversion(),
    'errors' => [],
    'config' => [],
    'database' => []
];

// Check if config.php exists
if (file_exists(__DIR__ . '/config.php')) {
    $debug['config']['file_exists'] = true;
    
    try {
        require_once __DIR__ . '/config.php';
        $debug['config']['loaded'] = true;
        
        // Check functions
        $debug['config']['functions'] = [
            'getDBConnection' => function_exists('getDBConnection'),
            'sendError' => function_exists('sendError'),
            'sendResponse' => function_exists('sendResponse'),
            'initializeDatabase' => function_exists('initializeDatabase')
        ];
        
        // Check database constants
        $debug['config']['constants'] = [
            'DB_HOST' => defined('DB_HOST') ? DB_HOST : 'NOT DEFINED',
            'DB_USER' => defined('DB_USER') ? DB_USER : 'NOT DEFINED',
            'DB_NAME' => defined('DB_NAME') ? DB_NAME : 'NOT DEFINED',
            'DB_PASS' => defined('DB_PASS') ? (empty(DB_PASS) ? 'EMPTY' : 'SET') : 'NOT DEFINED'
        ];
        
        // Try database connection
        if (function_exists('getDBConnection')) {
            try {
                $conn = getDBConnection();
                if ($conn) {
                    $debug['database']['connected'] = true;
                    $debug['database']['host_info'] = $conn->host_info;
                    $conn->close();
                } else {
                    $debug['database']['connected'] = false;
                    $debug['database']['error'] = 'getDBConnection returned null';
                }
            } catch (Exception $e) {
                $debug['database']['error'] = $e->getMessage();
            }
        }
        
    } catch (Exception $e) {
        $debug['config']['error'] = $e->getMessage();
        $debug['config']['trace'] = $e->getTraceAsString();
    } catch (Error $e) {
        $debug['config']['fatal_error'] = $e->getMessage();
        $debug['config']['file'] = $e->getFile();
        $debug['config']['line'] = $e->getLine();
    }
} else {
    $debug['config']['file_exists'] = false;
    $debug['config']['path_checked'] = __DIR__ . '/config.php';
}

// Check PHP extensions
$debug['extensions'] = [
    'mysqli' => extension_loaded('mysqli'),
    'json' => extension_loaded('json'),
    'session' => extension_loaded('session')
];

// Check file permissions
$debug['permissions'] = [
    'config_php_readable' => is_readable(__DIR__ . '/config.php'),
    'directory_writable' => is_writable(__DIR__)
];

echo json_encode($debug, JSON_PRETTY_PRINT);
?>

