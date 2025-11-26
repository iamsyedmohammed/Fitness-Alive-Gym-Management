<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            sendError('Invalid JSON data: ' . json_last_error_msg(), 400);
        }
        
        $id = $input['id'] ?? 0;
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? null;
        $phone = $input['phone'] ?? null;
        $address = $input['address'] ?? null;
        $membership_type = $input['membership_type'] ?? null;
        $training_type = $input['training_type'] ?? null;
        $price = isset($input['price']) && $input['price'] !== '' ? (float)$input['price'] : null;
        $start_date = $input['start_date'] ?? null;
        $end_date = $input['end_date'] ?? null;
        $status = $input['status'] ?? 'active';
        $trainer_id = !empty($input['trainer_id']) ? (int)$input['trainer_id'] : null;
        $image_url = $input['image_url'] ?? null;
        $location = $input['location'] ?? 'yakutpura';

        if (empty($id) || empty($name)) {
            sendError('ID and name are required', 400);
        }
        
        // Validate location
        if (!in_array($location, ['yakutpura', 'madanapet'])) {
            $location = 'yakutpura';
        }

        $conn = getDBConnection();
        
        if (!$conn) {
            sendError('Database connection failed', 500);
        }
        
        // Handle NULL price for decimal binding
        $priceValue = ($price === null || $price === '') ? 0.00 : (float)$price;
        
        $stmt = $conn->prepare("UPDATE gym_members SET name = ?, email = ?, phone = ?, address = ?, membership_type = ?, training_type = ?, price = ?, start_date = ?, end_date = ?, status = ?, trainer_id = ?, image_url = ?, location = ? WHERE id = ?");
        
        if (!$stmt) {
            $error = $conn->error;
            $conn->close();
            sendError('Failed to prepare statement: ' . $error, 500);
        }
        
        // Parameter types: name(s), email(s), phone(s), address(s), membership_type(s), training_type(s), price(d), start_date(s), end_date(s), status(s), trainer_id(i), image_url(s), location(s), id(i)
        // Total: 14 parameters - "ssssssdsssissi"
        $stmt->bind_param("ssssssdsssissi", $name, $email, $phone, $address, $membership_type, $training_type, $priceValue, $start_date, $end_date, $status, $trainer_id, $image_url, $location, $id);

        if ($stmt->execute()) {
            $stmt->close();
            $conn->close();
            sendResponse(['success' => true]);
        } else {
            $error = $stmt->error;
            $stmt->close();
            $conn->close();
            sendError('Failed to update member: ' . $error, 500);
        }
    } catch (Exception $e) {
        if (isset($conn) && $conn) {
            $conn->close();
        }
        sendError('Error updating member: ' . $e->getMessage(), 500);
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

