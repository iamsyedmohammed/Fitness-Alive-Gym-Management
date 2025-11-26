<?php
require_once 'config.php';

// Allow both GET and POST
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Default plans data
$defaultPlans = [
    ['plan_name' => 'CARDIO', 'billing_amount' => 1200.00, 'fee' => 1200.00, 'initial_fee' => 100.00, 'years' => 0, 'months' => 1, 'days' => 0],
    ['plan_name' => 'CARDIO - 1 Year', 'billing_amount' => 8000.00, 'fee' => 8000.00, 'initial_fee' => 0.00, 'years' => 1, 'months' => 0, 'days' => 0],
    ['plan_name' => 'CARDIO - Half Yearly', 'billing_amount' => 4500.00, 'fee' => 4500.00, 'initial_fee' => 0.00, 'years' => 0, 'months' => 6, 'days' => 0],
    ['plan_name' => 'CARDIO-Quaterly', 'billing_amount' => 2800.00, 'fee' => 2800.00, 'initial_fee' => 0.00, 'years' => 0, 'months' => 3, 'days' => 0],
    ['plan_name' => 'GYM', 'billing_amount' => 600.00, 'fee' => 600.00, 'initial_fee' => 100.00, 'years' => 0, 'months' => 1, 'days' => 0],
    ['plan_name' => 'GYM - 1 Year', 'billing_amount' => 5000.00, 'fee' => 5000.00, 'initial_fee' => 0.00, 'years' => 1, 'months' => 0, 'days' => 0],
    ['plan_name' => 'GYM - Half Yearly', 'billing_amount' => 2800.00, 'fee' => 2800.00, 'initial_fee' => 0.00, 'years' => 0, 'months' => 6, 'days' => 0],
    ['plan_name' => 'GYM-Quarterly', 'billing_amount' => 1500.00, 'fee' => 1500.00, 'initial_fee' => 100.00, 'years' => 0, 'months' => 3, 'days' => 0],
    ['plan_name' => 'Half Month', 'billing_amount' => 300.00, 'fee' => 300.00, 'initial_fee' => 100.00, 'years' => 0, 'months' => 0, 'days' => 15],
    ['plan_name' => 'Mor + Eve', 'billing_amount' => 1000.00, 'fee' => 1000.00, 'initial_fee' => 100.00, 'years' => 0, 'months' => 1, 'days' => 0],
    ['plan_name' => 'Two Months', 'billing_amount' => 1000.00, 'fee' => 1000.00, 'initial_fee' => 100.00, 'years' => 0, 'months' => 2, 'days' => 0],
];

$conn = getDBConnection();

if (!$conn) {
    sendError('Database connection failed');
}

$added = 0;
$skipped = 0;
$errors = [];

foreach ($defaultPlans as $plan) {
    // Check if plan already exists
    $checkStmt = $conn->prepare("SELECT id FROM plans WHERE plan_name = ?");
    $checkStmt->bind_param("s", $plan['plan_name']);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows > 0) {
        $skipped++;
        $checkStmt->close();
        continue;
    }
    $checkStmt->close();
    
    // Insert plan
    $stmt = $conn->prepare("INSERT INTO plans (plan_name, billing_amount, fee, initial_fee, years, months, days) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sdddddd", 
        $plan['plan_name'], 
        $plan['billing_amount'], 
        $plan['fee'], 
        $plan['initial_fee'], 
        $plan['years'], 
        $plan['months'], 
        $plan['days']
    );
    
    if ($stmt->execute()) {
        $added++;
    } else {
        $errors[] = $plan['plan_name'] . ': ' . $stmt->error;
    }
    
    $stmt->close();
}

$conn->close();

sendResponse([
    'success' => true,
    'message' => "Plans added successfully. Added: $added, Skipped: $skipped",
    'added' => $added,
    'skipped' => $skipped,
    'errors' => $errors
]);
?>

