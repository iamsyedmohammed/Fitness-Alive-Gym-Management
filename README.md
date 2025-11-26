# GYM Management System

A comprehensive gym management system built with React and PHP.

## Features

- **Admin Dashboard** - Overview with statistics and quick actions
- **Trainers Management** - Add, edit, delete, and manage trainers
- **Members Management** - Complete member lifecycle management
- **Attendance Tracking** - Check-in/check-out functionality
- **Workout Sessions** - Schedule and manage training sessions
- **Payments** - Record and track payments
- **Memberships** - Manage membership plans and track expiring memberships
- **WhatsApp Integration** - Send messages to members and trainers
- **Analytics & Reports** - View revenue, attendance, and growth statistics
- **Settings** - Configure gym information

## Setup Instructions

### 1. Database Setup

1. Make sure MySQL/MariaDB is running
2. Update database credentials in `api/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'gym_management');
   ```

3. The database and tables will be created automatically on first API call

### 2. Backend Setup (PHP)

1. Place the `api` folder in your web server directory (e.g., `htdocs`, `www`, or `public_html`)
2. Or configure your web server to point to the `api` folder
3. Update API URLs in React components if needed (currently set to `http://localhost/gym-management/api/`)

### 3. Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. The app will open at `http://localhost:3000`

## Default Login

- **Email:** admin@gym.com
- **Password:** admin123

## API Endpoints

All API endpoints are in the `api/` directory:

- `adminLogin.php` - Admin authentication
- `getTrainers.php` - Get all trainers
- `addTrainer.php` - Add new trainer
- `updateTrainer.php` - Update trainer
- `deleteTrainer.php` - Delete trainer
- `getMembers.php` - Get all members
- `addMember.php` - Add new member
- `updateMember.php` - Update member
- `deleteMember.php` - Delete member
- `recordAttendance.php` - Record check-in/check-out
- `getAttendance.php` - Get attendance records
- `scheduleSession.php` - Schedule workout session
- `getWorkoutSessions.php` - Get all sessions
- `recordPayment.php` - Record payment
- `getPayments.php` - Get all payments
- `getMemberships.php` - Get all memberships
- `getDashboardStats.php` - Get dashboard statistics
- `getAnalytics.php` - Get analytics data
- `updateSettings.php` - Update settings

## Project Structure

```
gym-management/
├── api/                 # PHP backend API
├── public/              # Public assets
├── src/
│   ├── components/      # React components
│   │   └── admin/      # Admin components
│   ├── pages/          # Page components
│   │   └── Admin/      # Admin pages
│   └── App.js          # Main app with routing
└── package.json
```

## Technologies Used

- **Frontend:** React, React Router DOM
- **Backend:** PHP, MySQL
- **Styling:** CSS3

## Notes

- Make sure CORS is properly configured if API is on a different domain
- Update API base URL in all components if your API is hosted elsewhere
- The system automatically creates the database and tables on first use
- WhatsApp integration uses `wa.me` links (opens WhatsApp on admin's device)
