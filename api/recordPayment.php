<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set CORS headers first, before any output
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

session_start();
$location = $_SESSION['location'] ?? 'yakutpura';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            sendError('Invalid JSON data: ' . json_last_error_msg(), 400);
        }
        
        $member_id = $input['member_id'] ?? 0;
        $amount = $input['amount'] ?? 0;
        $payment_date = $input['payment_date'] ?? date('Y-m-d');
        $payment_method = $input['payment_method'] ?? 'cash';
        $description = $input['description'] ?? null;
        $status = $input['status'] ?? 'completed';

        if (empty($member_id) || empty($amount)) {
            sendError('Member ID and amount are required', 400);
        }

        if ($amount <= 0) {
            sendError('Amount must be greater than 0', 400);
        }

        // Validate location
        if (!in_array($location, ['yakutpura', 'madanapet'])) {
            $location = 'yakutpura';
        }

        $conn = getDBConnection();
        
        if (!$conn) {
            sendError('Database connection failed', 500);
        }

        $stmt = $conn->prepare("INSERT INTO payments (member_id, amount, payment_date, payment_method, description, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        if (!$stmt) {
            $error = $conn->error;
            $conn->close();
            sendError('Failed to prepare statement: ' . $error, 500);
        }
        
        $stmt->bind_param("idsssss", $member_id, $amount, $payment_date, $payment_method, $description, $location, $status);

        if ($stmt->execute()) {
            $payment_id = $conn->insert_id;
            $stmt->close();
            $conn->close();
            sendResponse(['success' => true, 'id' => $payment_id]);
        } else {
            $error = $stmt->error;
            $stmt->close();
            $conn->close();
            sendError('Failed to record payment: ' . $error, 500);
        }
    } catch (Exception $e) {
        if (isset($conn) && $conn) {
            $conn->close();
        }
        sendError('Error recording payment: ' . $e->getMessage(), 500);
    } catch (Error $e) {
        if (isset($conn) && $conn) {
            $conn->close();
        }
        sendError('Fatal error: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

