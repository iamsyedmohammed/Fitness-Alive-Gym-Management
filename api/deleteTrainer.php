<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? 0;

    if (empty($id)) {
        sendError('ID is required');
    }

    $conn = getDBConnection();
    $stmt = $conn->prepare("DELETE FROM trainers WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        sendResponse(['success' => true]);
    } else {
        sendError('Failed to delete trainer');
    }
} else {
    sendError('Method not allowed', 405);
}
?>

