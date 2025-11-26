<?php
// Test to see what headers are actually being sent
header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Show all headers that would be sent
echo "Request Method: " . $_SERVER['REQUEST_METHOD'] . "\n\n";
echo "Headers being sent:\n";
$headers = headers_list();
foreach ($headers as $header) {
    echo $header . "\n";
}
?>

