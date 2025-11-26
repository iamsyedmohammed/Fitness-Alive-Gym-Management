<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['id']) && isset($input['status'])) {
        // Update status
        $id = $input['id'];
        $status = $input['status'];
        
        $conn = getDBConnection();
        $stmt = $conn->prepare("UPDATE workout_sessions SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $id);
        
        if ($stmt->execute()) {
            sendResponse(['success' => true]);
        } else {
            sendError('Failed to update session');
        }
    } else {
        // Create session
        $member_id = $input['member_id'] ?? 0;
        $trainer_id = $input['trainer_id'] ?? 0;
        $session_date = $input['session_date'] ?? '';
        $session_time = $input['session_time'] ?? '';
        $duration = $input['duration'] ?? 60;
        $notes = $input['notes'] ?? null;

        if (empty($member_id) || empty($trainer_id) || empty($session_date) || empty($session_time)) {
            sendError('All fields are required');
        }

        $conn = getDBConnection();
        $stmt = $conn->prepare("INSERT INTO workout_sessions (member_id, trainer_id, session_date, session_time, duration, notes) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iissis", $member_id, $trainer_id, $session_date, $session_time, $duration, $notes);

        if ($stmt->execute()) {
            sendResponse(['success' => true, 'id' => $conn->insert_id]);
        } else {
            sendError('Failed to schedule session');
        }
    }
} else {
    sendError('Method not allowed', 405);
}
?>

