<?php
require_once 'config.php';

$conn = getDBConnection();

// Get statistics
$stats = [];

// Total and active members
$result = $conn->query("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active FROM gym_members");
$row = $result->fetch_assoc();
$stats['totalMembers'] = (int)$row['total'];
$stats['activeMembers'] = (int)$row['active'];

// Total and active trainers
$result = $conn->query("SELECT COUNT(*) as total, SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active FROM trainers");
$row = $result->fetch_assoc();
$stats['totalTrainers'] = (int)$row['total'];
$stats['activeTrainers'] = (int)$row['active'];

// Today's attendance
$today = date('Y-m-d');
$result = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE date = '$today'");
$row = $result->fetch_assoc();
$stats['todayAttendance'] = (int)$row['count'];

// Monthly revenue
$monthStart = date('Y-m-01');
$result = $conn->query("SELECT SUM(amount) as total FROM payments WHERE payment_date >= '$monthStart' AND status = 'completed'");
$row = $result->fetch_assoc();
$stats['monthlyRevenue'] = (float)($row['total'] ?? 0);

// Recent activity (last 10 activities)
$recentActivity = [];
$result = $conn->query("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 10");
while ($row = $result->fetch_assoc()) {
    $recentActivity[] = [
        'description' => $row['activity_description'],
        'time' => date('M d, Y H:i', strtotime($row['created_at']))
    ];
}

sendResponse([
    'success' => true,
    'stats' => $stats,
    'recentActivity' => $recentActivity
]);
?>

