<?php
require_once 'config.php';

session_start();
$location = $_SESSION['location'] ?? 'yakutpura';
$date = $_GET['date'] ?? date('Y-m-d');
$member_id = $_GET['member_id'] ?? null;

$conn = getDBConnection();

if (!$conn) {
    sendError('Database connection failed', 500);
}

// Build query based on filters
if ($member_id) {
    // Filter by member_id - show all attendance for this member
    $stmt = $conn->prepare("SELECT * FROM attendance WHERE member_id = ? AND location = ? ORDER BY date DESC, check_in_time DESC");
    $stmt->bind_param("is", $member_id, $location);
} else {
    // Filter by date - show all members for this date
    $stmt = $conn->prepare("SELECT * FROM attendance WHERE date = ? AND location = ? ORDER BY check_in_time DESC");
    $stmt->bind_param("ss", $date, $location);
}

$stmt->execute();
$result = $stmt->get_result();

$attendance = [];
while ($row = $result->fetch_assoc()) {
    $attendance[] = $row;
}

$stmt->close();
$conn->close();

sendResponse([
    'success' => true,
    'attendance' => $attendance
]);
?>

