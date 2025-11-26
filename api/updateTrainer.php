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
        $specialization = $input['specialization'] ?? null;
        $experience = $input['experience'] ?? null;
        $bio = $input['bio'] ?? null;
        $image_url = $input['image_url'] ?? null;
        $is_active = isset($input['is_active']) ? (int)$input['is_active'] : 1;
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
        
        // Parameter types: name(s), email(s), phone(s), address(s), specialization(s), experience(s), bio(s), image_url(s), location(s), is_active(i), id(i)
        // Total: 11 parameters
        $stmt = $conn->prepare("UPDATE trainers SET name = ?, email = ?, phone = ?, address = ?, specialization = ?, experience = ?, bio = ?, image_url = ?, location = ?, is_active = ? WHERE id = ?");
        
        if (!$stmt) {
            $error = $conn->error;
            $conn->close();
            sendError('Failed to prepare statement: ' . $error, 500);
        }
        
        $stmt->bind_param("sssssssssii", $name, $email, $phone, $address, $specialization, $experience, $bio, $image_url, $location, $is_active, $id);

        if ($stmt->execute()) {
            $stmt->close();
            $conn->close();
            sendResponse(['success' => true]);
        } else {
            $error = $stmt->error;
            $stmt->close();
            $conn->close();
            sendError('Failed to update trainer: ' . $error, 500);
        }
    } catch (Exception $e) {
        if (isset($conn) && $conn) {
            $conn->close();
        }
        sendError('Error updating trainer: ' . $e->getMessage(), 500);
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

