<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? null;
    $phone = $input['phone'] ?? null;
    $address = $input['address'] ?? null;
    $specialization = $input['specialization'] ?? null;
    $experience = $input['experience'] ?? null;
    $bio = $input['bio'] ?? null;
    $image_url = $input['image_url'] ?? null;
    $gender = $input['gender'] ?? null;
    $date_of_birth = $input['date_of_birth'] ?? null;
    $shift = $input['shift'] ?? null;
    $is_active = isset($input['is_active']) ? (int)$input['is_active'] : 1;
    $location = $input['location'] ?? 'yakutpura';

    if (empty($name)) {
        sendError('Name is required');
    }
    
    // Validate location
    if (!in_array($location, ['yakutpura', 'madanapet'])) {
        $location = 'yakutpura';
    }
    
    // Generate unique trainer code
    $conn = getDBConnection();
    $trainer_code = '';
    do {
        $prefix = strtoupper(substr($location, 0, 2)); // YA or MA
        $random = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $trainer_code = $prefix . 'T' . $random;
        
        $check = $conn->prepare("SELECT id FROM trainers WHERE trainer_code = ?");
        $check->bind_param("s", $trainer_code);
        $check->execute();
        $result = $check->get_result();
        $check->close();
    } while ($result->num_rows > 0);

    $stmt = $conn->prepare("INSERT INTO trainers (trainer_code, name, email, phone, address, specialization, experience, bio, image_url, gender, date_of_birth, shift, location, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssissssssi", $trainer_code, $name, $email, $phone, $address, $specialization, $experience, $bio, $image_url, $gender, $date_of_birth, $shift, $location, $is_active);

    if ($stmt->execute()) {
        sendResponse(['success' => true, 'id' => $conn->insert_id]);
    } else {
        sendError('Failed to add trainer');
    }
} else {
    sendError('Method not allowed', 405);
}
?>

