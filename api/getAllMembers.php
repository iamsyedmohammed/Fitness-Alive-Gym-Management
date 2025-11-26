<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set CORS headers first, before any output
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$conn = getDBConnection();

if (!$conn) {
    sendError('Database connection failed', 500);
}

// Get all members (no filters for testing)
$result = $conn->query("SELECT * FROM gym_members ORDER BY created_at DESC");

if (!$result) {
    sendError('Failed to fetch members: ' . $conn->error, 500);
}

$members = [];
while ($row = $result->fetch_assoc()) {
    $members[] = $row;
}

$totalCount = count($members);

// Count by status
$statusCounts = [
    'active' => 0,
    'inactive' => 0,
    'expired' => 0
];

foreach ($members as $member) {
    $status = $member['status'] ?? 'active';
    if (isset($statusCounts[$status])) {
        $statusCounts[$status]++;
    }
}

// Count by location
$locationCounts = [
    'yakutpura' => 0,
    'madanapet' => 0
];

foreach ($members as $member) {
    $location = $member['location'] ?? 'yakutpura';
    if (isset($locationCounts[$location])) {
        $locationCounts[$location]++;
    }
}

$conn->close();

sendResponse([
    'success' => true,
    'total_members' => $totalCount,
    'status_counts' => $statusCounts,
    'location_counts' => $locationCounts,
    'members' => $members
]);
?>

