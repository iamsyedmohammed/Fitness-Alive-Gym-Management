<?php
// Simple test to check database connection
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

$result = [
    'success' => false,
    'message' => '',
    'details' => []
];

// Test MySQL server connection (without database)
$testConn = @new mysqli(DB_HOST, DB_USER, DB_PASS);
if ($testConn->connect_error) {
    $result['message'] = 'Cannot connect to MySQL server';
    $result['details'] = [
        'error' => $testConn->connect_error,
        'host' => DB_HOST,
        'user' => DB_USER,
        'suggestion' => 'Check if host should be "localhost" instead'
    ];
} else {
    $result['details']['mysql_server'] = 'Connected successfully';
    $testConn->close();
    
    // Test database connection
    $conn = getDBConnection();
    if ($conn) {
        $result['success'] = true;
        $result['message'] = 'Database connection successful!';
        $result['details']['database'] = DB_NAME;
        $result['details']['host'] = DB_HOST;
        
        // Check if admin_accounts table exists
        $tables = $conn->query("SHOW TABLES LIKE 'admin_accounts'");
        if ($tables && $tables->num_rows > 0) {
            $result['details']['tables_exist'] = true;
        } else {
            $result['details']['tables_exist'] = false;
            $result['details']['note'] = 'Tables not created yet. They will be created on first API call.';
        }
        $conn->close();
    } else {
        $result['message'] = 'Cannot connect to database "' . DB_NAME . '"';
        $result['details'] = [
            'database_name' => DB_NAME,
            'suggestion' => 'Make sure the database exists in Hostinger hPanel. Database name should be: ' . DB_NAME
        ];
    }
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>

