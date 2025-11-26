<?php
// Set CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

session_start();
$location = $_SESSION['location'] ?? 'yakutpura';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $type = $input['type'] ?? 'all'; // 'payment', 'renewal', 'all'
    $memberIds = $input['member_ids'] ?? [];
    
    $conn = getDBConnection();
    if (!$conn) {
        sendError('Database connection failed', 500);
    }
    
    $sent = [];
    $failed = [];
    
    // Get reminders based on type
    $nextWeek = date('Y-m-d', strtotime('+7 days'));
    
    if ($type === 'payment' || $type === 'all') {
        $sql = "
            SELECT gm.id, gm.name, gm.phone, gm.email, gm.next_bill_date, gm.due_amount
            FROM gym_members gm
            WHERE gm.status = 'active'
            AND gm.location = ?
            AND (
                (gm.next_bill_date BETWEEN CURDATE() AND ?)
                OR (gm.next_bill_date < CURDATE() AND (gm.due_amount > 0 OR gm.next_bill_date IS NOT NULL))
            )
        ";
        
        if (!empty($memberIds)) {
            $placeholders = str_repeat('?,', count($memberIds) - 1) . '?';
            $sql .= " AND gm.id IN ($placeholders)";
        }
        
        $sql .= " ORDER BY gm.next_bill_date ASC";
        
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            $conn->close();
            sendError('Failed to prepare statement: ' . $conn->error, 500);
        }
        
        if (!empty($memberIds)) {
            $params = array_merge([$location, $nextWeek], $memberIds);
            $types = 'ss' . str_repeat('i', count($memberIds));
            $stmt->bind_param($types, ...$params);
        } else {
            $stmt->bind_param("ss", $location, $nextWeek);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            if ($row['phone']) {
                $dueAmount = number_format((float)($row['due_amount'] ?? 0), 2);
                $message = "Hi {$row['name']}, your payment of ₹{$dueAmount} is due on {$row['next_bill_date']}. Please make the payment to continue your membership.";
                $sent[] = [
                    'member_id' => $row['id'],
                    'name' => $row['name'],
                    'phone' => $row['phone'],
                    'type' => 'payment',
                    'message' => $message
                ];
            }
        }
        $stmt->close();
    }
    
    if ($type === 'renewal' || $type === 'all') {
        $sql = "
            SELECT gm.id, gm.name, gm.phone, gm.email, m.end_date, m.plan_name, m.price
            FROM gym_members gm
            INNER JOIN memberships m ON gm.id = m.member_id
            WHERE m.end_date BETWEEN CURDATE() AND ?
            AND gm.status = 'active'
            AND gm.location = ?
        ";
        
        if (!empty($memberIds)) {
            $placeholders = str_repeat('?,', count($memberIds) - 1) . '?';
            $sql .= " AND gm.id IN ($placeholders)";
        }
        
        $sql .= " ORDER BY m.end_date ASC";
        
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            $conn->close();
            sendError('Failed to prepare statement: ' . $conn->error, 500);
        }
        
        if (!empty($memberIds)) {
            $params = array_merge([$nextWeek, $location], $memberIds);
            $types = 'ss' . str_repeat('i', count($memberIds));
            $stmt->bind_param($types, ...$params);
        } else {
            $stmt->bind_param("ss", $nextWeek, $location);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            if ($row['phone']) {
                $price = number_format((float)($row['price'] ?? 0), 2);
                $message = "Hi {$row['name']}, your {$row['plan_name']} membership expires on {$row['end_date']}. Please renew to continue enjoying our services!";
                $sent[] = [
                    'member_id' => $row['id'],
                    'name' => $row['name'],
                    'phone' => $row['phone'],
                    'type' => 'renewal',
                    'message' => $message
                ];
            }
        }
        $stmt->close();
    }
    
    $conn->close();
    
    sendResponse([
        'success' => true,
        'sent' => $sent,
        'failed' => $failed,
        'total_sent' => count($sent)
    ]);
} else {
    sendError('Method not allowed', 405);
}
?>

