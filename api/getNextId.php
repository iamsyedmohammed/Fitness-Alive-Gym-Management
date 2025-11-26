<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $conn = getDBConnection();
    
    // Get the maximum member_id to determine the next one
    // We use the AUTO_INCREMENT id if possible, or parse member_code if they are strictly numeric now.
    // Since the user wants "1, 2, 3", using the table's auto-increment ID is the most robust way for the "next" number.
    // However, to display it BEFORE insertion, we can check the AUTO_INCREMENT value from information_schema or just MAX(id) + 1.
    
    $result = $conn->query("SELECT MAX(id) as max_id FROM gym_members");
    $row = $result->fetch_assoc();
    $nextId = ($row['max_id'] ?? 0) + 1;
    
    echo json_encode(['success' => true, 'next_id' => $nextId]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
