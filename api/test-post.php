<?php
// Test POST request handling
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    echo json_encode([
        'success' => true,
        'message' => 'POST request received',
        'input' => $input,
        'method' => $_SERVER['REQUEST_METHOD']
    ]);
} else {
    echo json_encode([
        'error' => 'Method not allowed',
        'method' => $_SERVER['REQUEST_METHOD']
    ]);
}
?>

