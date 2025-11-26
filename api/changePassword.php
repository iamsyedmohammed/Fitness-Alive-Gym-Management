<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['current_password']) || !isset($input['new_password'])) {
        sendError('Current password and new password are required');
    }
    
    $conn = getDBConnection();
    
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    // Try to get admin_id from session first
    session_start();
    $admin_id = null;
    
    if (isset($_SESSION['admin_id'])) {
        $admin_id = $_SESSION['admin_id'];
    } else {
        // Fallback: try to get admin_id from token in Authorization header or request
        $token = null;
        
        // Check Authorization header (works in both Apache and other servers)
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
        } elseif (function_exists('getallheaders')) {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $token = str_replace('Bearer ', '', $headers['Authorization']);
            }
        }
        
        // Also check in request body and GET params
        if (!$token && isset($input['token'])) {
            $token = $input['token'];
        } elseif (!$token && isset($_GET['token'])) {
            $token = $_GET['token'];
        }
        
        if ($token) {
            $stmt = $conn->prepare("SELECT id FROM admin_accounts WHERE session_token = ?");
            $stmt->bind_param("s", $token);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $admin = $result->fetch_assoc();
                $admin_id = $admin['id'];
            }
            $stmt->close();
        }
    }
    
    if (!$admin_id) {
        $conn->close();
        sendError('Unauthorized. Please login again.', 401);
    }
    $current_password = $input['current_password'];
    $new_password = $input['new_password'];
    
    // Verify current password
    $stmt = $conn->prepare("SELECT password_hash FROM admin_accounts WHERE id = ?");
    $stmt->bind_param("i", $admin_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $stmt->close();
        $conn->close();
        sendError('Admin account not found');
    }
    
    $admin = $result->fetch_assoc();
    
    if (!password_verify($current_password, $admin['password_hash'])) {
        $stmt->close();
        $conn->close();
        sendError('Current password is incorrect');
    }
    
    // Update password
    $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE admin_accounts SET password_hash = ? WHERE id = ?");
    $stmt->bind_param("si", $new_password_hash, $admin_id);
    
    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendResponse(['success' => true, 'message' => 'Password changed successfully']);
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        sendError('Failed to change password: ' . $error);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

