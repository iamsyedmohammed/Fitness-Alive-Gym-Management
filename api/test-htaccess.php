<?php
// Test if .htaccess CORS headers are working
header('Content-Type: application/json');

// Check if CORS headers are set by .htaccess
$corsHeaders = [];
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    $corsHeaders['mod_headers'] = in_array('mod_headers', $modules);
    $corsHeaders['mod_rewrite'] = in_array('mod_rewrite', $modules);
}

// Get all headers
$allHeaders = headers_list();

echo json_encode([
    'success' => true,
    'message' => 'Test endpoint',
    'method' => $_SERVER['REQUEST_METHOD'],
    'apache_modules' => $corsHeaders,
    'headers_sent' => $allHeaders,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown'
], JSON_PRETTY_PRINT);
?>

