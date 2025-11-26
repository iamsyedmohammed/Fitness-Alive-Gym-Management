<?php
require_once 'config.php';

$conn = getDBConnection();
$result = $conn->query("SELECT * FROM memberships ORDER BY end_date DESC");
$memberships = [];

while ($row = $result->fetch_assoc()) {
    $memberships[] = $row;
}

sendResponse([
    'success' => true,
    'memberships' => $memberships
]);
?>

