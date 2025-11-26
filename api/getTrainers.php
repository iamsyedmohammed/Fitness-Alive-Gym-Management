<?php
require_once 'config.php';

session_start();
$location = $_SESSION['location'] ?? 'yakutpura';

$conn = getDBConnection();

$stmt = $conn->prepare("SELECT * FROM trainers WHERE location = ? ORDER BY created_at DESC");
$stmt->bind_param("s", $location);
$stmt->execute();
$result = $stmt->get_result();

$trainers = [];

while ($row = $result->fetch_assoc()) {
    $trainers[] = $row;
}

$stmt->close();
$conn->close();

sendResponse([
    'success' => true,
    'trainers' => $trainers
]);
?>

