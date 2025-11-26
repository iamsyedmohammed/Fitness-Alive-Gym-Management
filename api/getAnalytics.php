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

$analytics = [];

// Today's revenue
$today = date('Y-m-d');
$stmt = $conn->prepare("SELECT SUM(amount) as total FROM payments WHERE payment_date = ? AND status = 'completed' AND location = ?");
$stmt->bind_param("ss", $today, $location);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$analytics['todayRevenue'] = (float)($row['total'] ?? 0);
$stmt->close();

// Week's revenue
$weekStart = date('Y-m-d', strtotime('-7 days'));
$stmt = $conn->prepare("SELECT SUM(amount) as total FROM payments WHERE payment_date >= ? AND status = 'completed' AND location = ?");
$stmt->bind_param("ss", $weekStart, $location);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$analytics['weekRevenue'] = (float)($row['total'] ?? 0);
$stmt->close();

// Month's revenue
$monthStart = date('Y-m-01');
$stmt = $conn->prepare("SELECT SUM(amount) as total FROM payments WHERE payment_date >= ? AND status = 'completed' AND location = ?");
$stmt->bind_param("ss", $monthStart, $location);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$analytics['monthRevenue'] = (float)($row['total'] ?? 0);
$stmt->close();

// Revenue for last 30 days (for chart)
$revenueData = [];
for ($i = 29; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-$i days"));
    $stmt = $conn->prepare("SELECT SUM(amount) as total FROM payments WHERE payment_date = ? AND status = 'completed' AND location = ?");
    $stmt->bind_param("ss", $date, $location);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $revenueData[] = [
        'date' => $date,
        'revenue' => (float)($row['total'] ?? 0)
    ];
    $stmt->close();
}
$analytics['revenueChartData'] = $revenueData;

// New members this month
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM gym_members WHERE created_at >= ? AND location = ?");
$stmt->bind_param("ss", $monthStart, $location);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$analytics['newMembersThisMonth'] = (int)$row['count'];
$stmt->close();

// Total members
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM gym_members WHERE location = ?");
$stmt->bind_param("s", $location);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$analytics['totalMembers'] = (int)$row['count'];
$stmt->close();

// Member growth for last 30 days (for chart)
$memberGrowthData = [];
for ($i = 29; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-$i days"));
    $nextDate = date('Y-m-d', strtotime("-$i days +1 day"));
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM gym_members WHERE created_at >= ? AND created_at < ? AND location = ?");
    $stmt->bind_param("sss", $date, $nextDate, $location);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $memberGrowthData[] = [
        'date' => $date,
        'count' => (int)$row['count']
    ];
    $stmt->close();
}
$analytics['memberGrowthChartData'] = $memberGrowthData;

// Today's attendance
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM attendance WHERE date = ? AND location = ?");
$stmt->bind_param("ss", $today, $location);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$analytics['todayAttendance'] = (int)$row['count'];
$stmt->close();

// Week average attendance
$weekStart = date('Y-m-d', strtotime('-7 days'));
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM attendance WHERE date >= ? AND location = ?");
$stmt->bind_param("ss", $weekStart, $location);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$analytics['weekAverageAttendance'] = round((int)$row['count'] / 7, 1);
$stmt->close();

// Attendance for last 7 days (for chart)
$attendanceData = [];
for ($i = 6; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-$i days"));
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM attendance WHERE date = ? AND location = ?");
    $stmt->bind_param("ss", $date, $location);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $attendanceData[] = [
        'date' => $date,
        'count' => (int)$row['count']
    ];
    $stmt->close();
}
$analytics['attendanceChartData'] = $attendanceData;

// Active memberships
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM memberships m INNER JOIN gym_members gm ON m.member_id = gm.id WHERE m.end_date >= CURDATE() AND m.payment_status = 'paid' AND gm.location = ?");
$stmt->bind_param("s", $location);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$analytics['activeMemberships'] = (int)$row['count'];
$stmt->close();

// Expiring soon (next 7 days)
$nextWeek = date('Y-m-d', strtotime('+7 days'));
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM memberships m INNER JOIN gym_members gm ON m.member_id = gm.id WHERE m.end_date BETWEEN CURDATE() AND ? AND gm.location = ?");
$stmt->bind_param("ss", $nextWeek, $location);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$analytics['expiringSoon'] = (int)$row['count'];
$stmt->close();

// Expired memberships
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM memberships m INNER JOIN gym_members gm ON m.member_id = gm.id WHERE m.end_date < CURDATE() AND gm.location = ?");
$stmt->bind_param("s", $location);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$analytics['expiredMemberships'] = (int)$row['count'];
$stmt->close();

// Membership type distribution
$stmt = $conn->prepare("SELECT membership_type, COUNT(*) as count FROM gym_members WHERE location = ? GROUP BY membership_type");
$stmt->bind_param("s", $location);
$stmt->execute();
$result = $stmt->get_result();
$membershipDistribution = [];
while ($row = $result->fetch_assoc()) {
    if ($row['membership_type']) {
        $membershipDistribution[] = [
            'type' => $row['membership_type'],
            'count' => (int)$row['count']
        ];
    }
}
$analytics['membershipDistribution'] = $membershipDistribution;
$stmt->close();

// Payment method distribution
$stmt = $conn->prepare("SELECT payment_method, COUNT(*) as count FROM payments WHERE location = ? AND status = 'completed' GROUP BY payment_method");
$stmt->bind_param("s", $location);
$stmt->execute();
$result = $stmt->get_result();
$paymentMethodData = [];
while ($row = $result->fetch_assoc()) {
    $paymentMethodData[] = [
        'method' => $row['payment_method'],
        'count' => (int)$row['count']
    ];
}
$analytics['paymentMethodData'] = $paymentMethodData;
$stmt->close();

// Training type distribution
$stmt = $conn->prepare("SELECT training_type, COUNT(*) as count FROM gym_members WHERE location = ? AND training_type IS NOT NULL GROUP BY training_type");
$stmt->bind_param("s", $location);
$stmt->execute();
$result = $stmt->get_result();
$trainingTypeData = [];
while ($row = $result->fetch_assoc()) {
    $trainingTypeData[] = [
        'type' => $row['training_type'],
        'count' => (int)$row['count']
    ];
}
$analytics['trainingTypeData'] = $trainingTypeData;
$stmt->close();

$conn->close();

sendResponse([
    'success' => true,
    'analytics' => $analytics
]);
?>

