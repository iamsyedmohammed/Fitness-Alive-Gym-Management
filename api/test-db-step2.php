<?php
// Step 2: Test database connection
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'sql200.infinityfree.com';
$user = 'if0_40523907';
$pass = 'jh514vqfBwz';
$db = 'if0_40523907_gym_management';

$conn = @new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'step' => 'Database connection',
        'error' => $conn->connect_error,
        'host' => $host,
        'user' => $user,
        'database' => $db,
        'error_code' => $conn->connect_errno
    ], JSON_PRETTY_PRINT);
} else {
    echo json_encode([
        'success' => true,
        'step' => 'Database connection',
        'message' => 'Connected to database successfully!',
        'database' => $db
    ], JSON_PRETTY_PRINT);
    $conn->close();
}
?>

