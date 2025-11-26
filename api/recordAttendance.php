<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['id'])) {
        // Update check-out
        $id = $input['id'];
        $check_out_time = $input['check_out_time'] ?? null;
        
        $conn = getDBConnection();
        $stmt = $conn->prepare("UPDATE attendance SET check_out_time = ? WHERE id = ?");
        $stmt->bind_param("si", $check_out_time, $id);
        
        if ($stmt->execute()) {
            sendResponse(['success' => true]);
        } else {
            sendError('Failed to update attendance');
        }
    } else {
        // Create check-in
        $member_id = $input['member_id'] ?? 0;
        $date = $input['date'] ?? date('Y-m-d');
        $check_in_time = $input['check_in_time'] ?? date('Y-m-d H:i:s');
        $trainer_id = !empty($input['trainer_id']) ? (int)$input['trainer_id'] : null;

        if (empty($member_id)) {
            sendError('Member ID is required');
        }

        $conn = getDBConnection();
        $stmt = $conn->prepare("INSERT INTO attendance (member_id, date, check_in_time, trainer_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("issi", $member_id, $date, $check_in_time, $trainer_id);

        if ($stmt->execute()) {
            sendResponse(['success' => true, 'id' => $conn->insert_id]);
        } else {
            sendError('Failed to record attendance');
        }
    }
} else {
    sendError('Method not allowed', 405);
}
?>

