<?php
require_once 'config.php';

// Set CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        sendError('No file uploaded or upload error', 400);
    }

    $file = $_FILES['image'];
    $type = $_POST['type'] ?? 'general'; // 'member', 'trainer', or 'general'
    
    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $fileType = mime_content_type($file['tmp_name']);
    
    if (!in_array($fileType, $allowedTypes)) {
        sendError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.', 400);
    }
    
    // Validate file size (max 5MB)
    $maxSize = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $maxSize) {
        sendError('File size exceeds 5MB limit', 400);
    }
    
    // Create upload directory if it doesn't exist
    // For Hostinger: uploads should be accessible from public_html
    // Path structure: public_html/uploads/member/ or public_html/uploads/trainer/
    // Use DOCUMENT_ROOT to get the web root directory
    $documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__);
    
    // Check if we're in a 'public' subdirectory (local dev) or directly in web root (Hostinger)
    $baseDir = dirname(__DIR__);
    $publicDir = $baseDir . '/public';
    
    // If public directory exists, use it (local dev), otherwise use document root (Hostinger)
    if (file_exists($publicDir) && is_dir($publicDir)) {
        $uploadDir = $publicDir . '/uploads/' . $type . '/';
    } else {
        // On Hostinger, uploads should be directly in document root
        $uploadDir = $documentRoot . '/uploads/' . $type . '/';
    }
    
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            sendError('Failed to create upload directory. Please check permissions.', 500);
        }
    }
    
    // Generate unique filename
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = uniqid($type . '_', true) . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Return the URL path (relative to public folder)
        // This will be accessible as: https://yourdomain.com/uploads/member/filename.jpg
        $url = '/uploads/' . $type . '/' . $filename;
        sendResponse([
            'success' => true,
            'url' => $url,
            'filename' => $filename
        ]);
    } else {
        sendError('Failed to save uploaded file. Please check directory permissions.', 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

