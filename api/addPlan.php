<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['plan_name']) || !isset($input['billing_amount'])) {
        sendError('Plan name and billing amount are required');
    }
    
    $conn = getDBConnection();
    
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $plan_name = $input['plan_name'];
    $billing_amount = floatval($input['billing_amount']);
    $fee = isset($input['fee']) ? floatval($input['fee']) : $billing_amount;
    $initial_fee = isset($input['initial_fee']) ? floatval($input['initial_fee']) : 0;
    $years = isset($input['years']) ? intval($input['years']) : 0;
    $months = isset($input['months']) ? intval($input['months']) : 0;
    $days = isset($input['days']) ? intval($input['days']) : 0;
    
    $stmt = $conn->prepare("INSERT INTO plans (plan_name, billing_amount, fee, initial_fee, years, months, days) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sdddddd", $plan_name, $billing_amount, $fee, $initial_fee, $years, $months, $days);
    
    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendResponse(['success' => true, 'message' => 'Plan added successfully']);
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        sendError('Failed to add plan: ' . $error);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

