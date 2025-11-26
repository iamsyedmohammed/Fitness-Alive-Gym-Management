<?php
require_once 'config.php';

session_start();
$location = $_SESSION['location'] ?? 'yakutpura';

$conn = getDBConnection();

if (!$conn) {
    sendError('Database connection failed', 500);
}

$stmt = $conn->prepare("SELECT * FROM payments WHERE location = ? ORDER BY payment_date DESC, created_at DESC");
$stmt->bind_param("s", $location);
$stmt->execute();
$result = $stmt->get_result();

$payments = [];

while ($row = $result->fetch_assoc()) {
    $payments[] = $row;
}

$stmt->close();
$conn->close();

sendResponse([
    'success' => true,
    'payments' => $payments
]);
?>

