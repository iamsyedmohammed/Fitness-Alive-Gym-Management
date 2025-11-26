<?php
// Step 1: Test MySQL connection without database
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'sql200.infinityfree.com';
$user = 'if0_40523907';
$pass = 'jh514vqfBwz';

$conn = @new mysqli($host, $user, $pass);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'step' => 'MySQL server connection',
        'error' => $conn->connect_error,
        'host' => $host,
        'user' => $user
    ], JSON_PRETTY_PRINT);
} else {
    echo json_encode([
        'success' => true,
        'step' => 'MySQL server connection',
        'message' => 'Connected to MySQL server successfully!'
    ], JSON_PRETTY_PRINT);
    $conn->close();
}
?>

