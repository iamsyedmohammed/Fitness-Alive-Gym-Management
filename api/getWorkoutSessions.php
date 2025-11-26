<?php
require_once 'config.php';

$conn = getDBConnection();
$result = $conn->query("SELECT * FROM workout_sessions ORDER BY session_date DESC, session_time DESC");
$sessions = [];

while ($row = $result->fetch_assoc()) {
    $sessions[] = $row;
}

sendResponse([
    'success' => true,
    'sessions' => $sessions
]);
?>

