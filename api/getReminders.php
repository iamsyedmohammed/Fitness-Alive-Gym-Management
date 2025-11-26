<?php
// Set CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

session_start();
$location = $_SESSION['location'] ?? 'yakutpura';

$conn = getDBConnection();
if (!$conn) {
    sendError('Database connection failed', 500);
}

$reminders = [];

// Payment reminders (due in next 7 days or overdue)
$nextWeek = date('Y-m-d', strtotime('+7 days'));
$stmt = $conn->prepare("
    SELECT gm.id, gm.name, gm.phone, gm.email, gm.next_bill_date, gm.due_amount
    FROM gym_members gm
    WHERE gm.status = 'active'
    AND gm.location = ?
    AND (
        (gm.next_bill_date BETWEEN CURDATE() AND ?)
        OR (gm.next_bill_date < CURDATE() AND (gm.due_amount > 0 OR gm.next_bill_date IS NOT NULL))
    )
    ORDER BY gm.next_bill_date ASC
");
$stmt->bind_param("ss", $location, $nextWeek);
$stmt->execute();
$result = $stmt->get_result();

$paymentReminders = [];
while ($row = $result->fetch_assoc()) {
    $paymentReminders[] = $row;
}
$reminders['payment'] = $paymentReminders;
$stmt->close();

// Renewal reminders (memberships expiring in next 7 days)
$stmt = $conn->prepare("
    SELECT gm.id, gm.name, gm.phone, gm.email, m.end_date, m.plan_name, m.price
    FROM gym_members gm
    INNER JOIN memberships m ON gm.id = m.member_id
    WHERE m.end_date BETWEEN CURDATE() AND ?
    AND gm.status = 'active'
    AND gm.location = ?
    ORDER BY m.end_date ASC
");
$stmt->bind_param("ss", $nextWeek, $location);
$stmt->execute();
$result = $stmt->get_result();

$renewalReminders = [];
while ($row = $result->fetch_assoc()) {
    $renewalReminders[] = $row;
}
$reminders['renewal'] = $renewalReminders;
$stmt->close();

$conn->close();

sendResponse([
    'success' => true,
    'reminders' => $reminders
]);
?>

