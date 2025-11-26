<?php
// Suppress any output before headers
if (ob_get_level()) {
    ob_end_clean();
}
ob_start();

// Set CORS headers first, before any output
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit();
}

// Database configuration
// IMPORTANT: Copy this file to config.php and fill in your actual database credentials
// For InfinityFree: Get these from Control Panel -> MySQL Databases
// For Hostinger: Get these from hPanel -> Databases -> MySQL Databases
define('DB_HOST', 'sqlXXX.infinityfree.com'); // Replace with your database host
define('DB_USER', 'epiz_XXXXXX'); // Replace with your database username
define('DB_PASS', 'your_password_here'); // Replace with your database password
define('DB_NAME', 'epiz_XXXXXX_dbname'); // Replace with your database name

// Create database connection
function getDBConnection() {
    $conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        // Return error details for debugging
        error_log('Database connection failed: ' . $conn->connect_error);
        error_log('Attempted connection with: Host=' . DB_HOST . ', User=' . DB_USER . ', DB=' . DB_NAME);
        return null;
    }
    
    $conn->set_charset('utf8mb4');
    return $conn;
}

// Initialize database tables
function initializeDatabase() {
    // Note: On Hostinger, you usually can't create databases via PHP
    // The database must be created manually in hPanel first
    // This function only creates tables, not the database itself
    
    // Try to connect to the database (it should already exist)
    $conn = getDBConnection();
    
    if (!$conn) {
        // If connection fails, try to connect without database to check MySQL server
        $testConn = @new mysqli(DB_HOST, DB_USER, DB_PASS);
        if ($testConn->connect_error) {
            throw new Exception('Cannot connect to MySQL server: ' . $testConn->connect_error . '. Please check DB_HOST (should be "localhost" for Hostinger), DB_USER, and DB_PASS in config.php');
        }
        $testConn->close();
        
        // MySQL server is accessible but database doesn't exist
        throw new Exception('Database "' . DB_NAME . '" does not exist. Please create it in Hostinger hPanel -> Databases -> MySQL Databases first, then try again.');
    }
    
    // Create tables (using IF NOT EXISTS to avoid errors if they already exist)
    // Create admin_accounts first (no dependencies)
    $conn->query("CREATE TABLE IF NOT EXISTS admin_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        session_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Create trainers table
    $conn->query("CREATE TABLE IF NOT EXISTS trainers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trainer_code VARCHAR(50) UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        address TEXT,
        specialization VARCHAR(255),
        experience INT,
        bio TEXT,
        image_url VARCHAR(500),
        gender VARCHAR(20),
        date_of_birth DATE,
        shift VARCHAR(50),
        location ENUM('yakutpura', 'madanapet') DEFAULT 'yakutpura',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    
    // Add location column if it doesn't exist (for existing databases)
    $checkColumn = $conn->query("SHOW COLUMNS FROM trainers LIKE 'location'");
    if ($checkColumn->num_rows == 0) {
        $conn->query("ALTER TABLE trainers ADD COLUMN location ENUM('yakutpura', 'madanapet') DEFAULT 'yakutpura' AFTER image_url");
    }
    
    // Add new columns if they don't exist (for existing databases)
    $checkColumn = $conn->query("SHOW COLUMNS FROM trainers LIKE 'gender'");
    if ($checkColumn->num_rows == 0) {
        $conn->query("ALTER TABLE trainers ADD COLUMN gender VARCHAR(20) AFTER image_url");
    }
    $checkColumn = $conn->query("SHOW COLUMNS FROM trainers LIKE 'date_of_birth'");
    if ($checkColumn->num_rows == 0) {
        $conn->query("ALTER TABLE trainers ADD COLUMN date_of_birth DATE AFTER gender");
    }
    $checkColumn = $conn->query("SHOW COLUMNS FROM trainers LIKE 'shift'");
    if ($checkColumn->num_rows == 0) {
        $conn->query("ALTER TABLE trainers ADD COLUMN shift VARCHAR(50) AFTER date_of_birth");
    }
    
    // Add address column if it doesn't exist
    $checkAddress = $conn->query("SHOW COLUMNS FROM trainers LIKE 'address'");
    if ($checkAddress->num_rows == 0) {
        $conn->query("ALTER TABLE trainers ADD COLUMN address TEXT AFTER phone");
    }
    
    // Add trainer_code column if it doesn't exist
    $checkCode = $conn->query("SHOW COLUMNS FROM trainers LIKE 'trainer_code'");
    if ($checkCode->num_rows == 0) {
        $conn->query("ALTER TABLE trainers ADD COLUMN trainer_code VARCHAR(50) UNIQUE AFTER id");
    }
    
    // Create gym_members table (depends on trainers)
    $conn->query("CREATE TABLE IF NOT EXISTS gym_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_code VARCHAR(50) UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        address TEXT,
        membership_type VARCHAR(100),
        training_type ENUM('Cardio', 'Weight Training'),
        price DECIMAL(10, 2),
        start_date DATE,
        end_date DATE,
        status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
        trainer_id INT,
        image_url VARCHAR(500),
        location ENUM('yakutpura', 'madanapet') DEFAULT 'yakutpura',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL
    )");
    
    // Add image_url column if it doesn't exist (for existing databases)
    $checkColumn = $conn->query("SHOW COLUMNS FROM gym_members LIKE 'image_url'");
    if ($checkColumn->num_rows == 0) {
        $conn->query("ALTER TABLE gym_members ADD COLUMN image_url VARCHAR(500) AFTER trainer_id");
    }
    
    // Add location column if it doesn't exist (for existing databases)
    $checkLocation = $conn->query("SHOW COLUMNS FROM gym_members LIKE 'location'");
    if ($checkLocation->num_rows == 0) {
        $conn->query("ALTER TABLE gym_members ADD COLUMN location ENUM('yakutpura', 'madanapet') DEFAULT 'yakutpura' AFTER image_url");
    }
    
    // Add address column if it doesn't exist
    $checkAddress = $conn->query("SHOW COLUMNS FROM gym_members LIKE 'address'");
    if ($checkAddress->num_rows == 0) {
        $conn->query("ALTER TABLE gym_members ADD COLUMN address TEXT AFTER phone");
    }
    
    // Add member_code column if it doesn't exist
    $checkCode = $conn->query("SHOW COLUMNS FROM gym_members LIKE 'member_code'");
    if ($checkCode->num_rows == 0) {
        $conn->query("ALTER TABLE gym_members ADD COLUMN member_code VARCHAR(50) UNIQUE AFTER id");
    }
    
    // Add training_type column if it doesn't exist
    $checkTrainingType = $conn->query("SHOW COLUMNS FROM gym_members LIKE 'training_type'");
    if ($checkTrainingType->num_rows == 0) {
        $conn->query("ALTER TABLE gym_members ADD COLUMN training_type ENUM('Cardio', 'Weight Training') AFTER membership_type");
    }
    
    // Add price column if it doesn't exist
    $checkPrice = $conn->query("SHOW COLUMNS FROM gym_members LIKE 'price'");
    if ($checkPrice->num_rows == 0) {
        $conn->query("ALTER TABLE gym_members ADD COLUMN price DECIMAL(10, 2) DEFAULT NULL AFTER training_type");
    }
    
    $conn->query("CREATE TABLE IF NOT EXISTS memberships (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        plan_name VARCHAR(255),
        price DECIMAL(10, 2),
        start_date DATE,
        end_date DATE,
        payment_status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
        auto_renew BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES gym_members(id) ON DELETE CASCADE
    )");
    
    $conn->query("CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        check_in_time DATETIME,
        check_out_time DATETIME,
        date DATE,
        trainer_id INT,
        location ENUM('yakutpura', 'madanapet') DEFAULT 'yakutpura',
        notes TEXT,
        FOREIGN KEY (member_id) REFERENCES gym_members(id) ON DELETE CASCADE,
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL
    )");
    
    // Add location column if it doesn't exist (for existing databases)
    $checkLocation = $conn->query("SHOW COLUMNS FROM attendance LIKE 'location'");
    if ($checkLocation->num_rows == 0) {
        $conn->query("ALTER TABLE attendance ADD COLUMN location ENUM('yakutpura', 'madanapet') DEFAULT 'yakutpura' AFTER trainer_id");
    }
    
    $conn->query("CREATE TABLE IF NOT EXISTS workout_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        trainer_id INT NOT NULL,
        session_date DATE,
        session_time TIME,
        duration INT,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        location ENUM('yakutpura', 'madanapet') DEFAULT 'yakutpura',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES gym_members(id) ON DELETE CASCADE,
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE
    )");
    
    // Add location column if it doesn't exist (for existing databases)
    $checkLocation = $conn->query("SHOW COLUMNS FROM workout_sessions LIKE 'location'");
    if ($checkLocation->num_rows == 0) {
        $conn->query("ALTER TABLE workout_sessions ADD COLUMN location ENUM('yakutpura', 'madanapet') DEFAULT 'yakutpura' AFTER status");
    }
    
    $conn->query("CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        amount DECIMAL(10, 2),
        payment_date DATE,
        payment_method VARCHAR(50),
        description TEXT,
        location ENUM('yakutpura', 'madanapet') DEFAULT 'yakutpura',
        status ENUM('completed', 'pending', 'failed') DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES gym_members(id) ON DELETE CASCADE
    )");
    
    // Add location column if it doesn't exist (for existing databases)
    $checkLocation = $conn->query("SHOW COLUMNS FROM payments LIKE 'location'");
    if ($checkLocation->num_rows == 0) {
        $conn->query("ALTER TABLE payments ADD COLUMN location ENUM('yakutpura', 'madanapet') DEFAULT 'yakutpura' AFTER description");
    }
    
    // Create activity_log table (depends on admin_accounts)
    $conn->query("CREATE TABLE IF NOT EXISTS activity_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT,
        activity_type VARCHAR(100),
        activity_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admin_accounts(id) ON DELETE SET NULL
    )");
    
    // Create plans table
    $conn->query("CREATE TABLE IF NOT EXISTS plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plan_name VARCHAR(255) NOT NULL,
        billing_amount DECIMAL(10, 2) NOT NULL,
        fee DECIMAL(10, 2) DEFAULT NULL,
        initial_fee DECIMAL(10, 2) DEFAULT 0,
        years INT DEFAULT 0,
        months INT DEFAULT 0,
        days INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    
    // Create default admin account (password: admin123)
    $defaultEmail = 'admin@gym.com';
    $defaultPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT IGNORE INTO admin_accounts (email, password_hash) VALUES (?, ?)");
    $stmt->bind_param("ss", $defaultEmail, $defaultPassword);
    $stmt->execute();
    $stmt->close();
    
    $conn->close();
}

// Initialize database tables on first run
// Note: Database must be created manually in Hostinger hPanel first
// This function only creates tables, not the database
try {
    $testConn = getDBConnection();
    if ($testConn) {
        // Database exists, try to initialize tables if they don't exist
        initializeDatabase();
        $testConn->close();
    }
    // If connection fails, initializeDatabase will handle the error
} catch (Exception $e) {
    // Log error - this will help debug
    error_log('Database initialization error: ' . $e->getMessage());
    // Don't throw here - let individual API endpoints show the error to user
}

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

function sendError($message, $statusCode = 400) {
    sendResponse(['error' => $message], $statusCode);
}

function validateAdminSession() {
    session_start();
    if (!isset($_SESSION['admin_id'])) {
        sendError('Unauthorized', 401);
    }
    return $_SESSION['admin_id'];
}
?>

