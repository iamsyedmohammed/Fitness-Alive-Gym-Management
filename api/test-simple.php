<?php
// Very simple test - no database connection
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'success' => true,
    'message' => 'PHP is working!',
    'php_version' => phpversion()
], JSON_PRETTY_PRINT);
?>

