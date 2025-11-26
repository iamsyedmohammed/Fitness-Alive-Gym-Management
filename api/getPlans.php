<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $conn = getDBConnection();
    
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $stmt = $conn->prepare("SELECT * FROM plans ORDER BY created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $plans = [];
    while ($row = $result->fetch_assoc()) {
        $plans[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    sendResponse(['success' => true, 'plans' => $plans]);
} else {
    sendError('Method not allowed', 405);
}
?>

