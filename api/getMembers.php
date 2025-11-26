<?php
require_once 'config.php';

session_start();
$location = $_SESSION['location'] ?? 'yakutpura';

$conn = getDBConnection();

if (!$conn) {
    sendError('Database connection failed', 500);
}

// Filter by location if provided
$stmt = $conn->prepare("SELECT * FROM gym_members WHERE status = 'active' AND location = ? ORDER BY name ASC");
$stmt->bind_param("s", $location);
$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
    sendError('Failed to fetch members: ' . $conn->error, 500);
}

$members = [];
while ($row = $result->fetch_assoc()) {
    $members[] = $row;
}

$stmt->close();
$conn->close();

sendResponse([
    'success' => true,
    'members' => $members
]);
?>

