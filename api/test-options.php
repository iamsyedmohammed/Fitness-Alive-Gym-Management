<?php
// Test OPTIONS request handling
require_once __DIR__ . '/config.php';

// This should never run for OPTIONS requests (config.php exits)
echo json_encode([
    'success' => true,
    'message' => 'This should only appear for non-OPTIONS requests',
    'method' => $_SERVER['REQUEST_METHOD']
]);
?>

