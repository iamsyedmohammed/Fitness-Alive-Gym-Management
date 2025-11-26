<?php
// Test database connection
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

try {
    // Test database connection
    $conn = getDBConnection();
    
    if ($conn) {
        $result['success'] = true;
        $result['message'] = 'Database connection successful';
        $result['details']['host'] = DB_HOST;
        $result['details']['database'] = DB_NAME;
        $result['details']['user'] = DB_USER;
        
        // Test if admin_accounts table exists
        $tables = $conn->query("SHOW TABLES LIKE 'admin_accounts'");
        if ($tables && $tables->num_rows > 0) {
            $result['details']['admin_table_exists'] = true;
            
            // Check if admin account exists
            $adminCheck = $conn->query("SELECT COUNT(*) as count FROM admin_accounts");
            if ($adminCheck) {
                $row = $adminCheck->fetch_assoc();
                $result['details']['admin_accounts_count'] = $row['count'];
            }
        } else {
            $result['details']['admin_table_exists'] = false;
            $result['message'] = 'Database connected but admin_accounts table not found. Run initializeDatabase() once.';
        }
        
        $conn->close();
    } else {
        $result['message'] = 'Database connection failed';
        $result['details']['error'] = 'Could not connect to database. Check credentials in config.php';
    }
} catch (Exception $e) {
    $result['message'] = 'Error: ' . $e->getMessage();
    $result['details']['exception'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>

