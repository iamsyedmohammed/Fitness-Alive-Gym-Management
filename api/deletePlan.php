<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        sendError('Plan ID is required');
    }
    
    $conn = getDBConnection();
    
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $id = intval($input['id']);
    
    $stmt = $conn->prepare("DELETE FROM plans WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendResponse(['success' => true, 'message' => 'Plan deleted successfully']);
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        sendError('Failed to delete plan: ' . $error);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

