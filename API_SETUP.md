# API Setup Guide

## Quick Setup Steps

### 1. Check PHP Server is Running

**For XAMPP:**
- Open XAMPP Control Panel
- Start **Apache** service
- Verify it's running (green indicator)

**For WAMP:**
- Open WAMP Control Panel
- Click "Start All Services"
- Verify Apache is running (icon should be green)

**For MAMP:**
- Open MAMP
- Click "Start Servers"
- Verify Apache is running

### 2. Verify Project Location

Your project should be in:
- **XAMPP:** `C:\xampp\htdocs\gym-management\`
- **WAMP:** `C:\wamp64\www\gym-management\` (or `C:\wamp\www\gym-management\`)
- **MAMP:** `/Applications/MAMP/htdocs/gym-management/`

### 3. Test API Directly

Open in browser:
```
http://localhost/gym-management/api/adminLogin.php
```

You should see a JSON response (even if it's an error like "Method not allowed" - that's fine, it means the server is working).

### 4. Check API URL in React App

The React app uses:
```
http://localhost/gym-management/api/adminLogin.php
```

**If your project is in a different location, update the URL in:**
- `src/pages/AdminLoginPage.js`
- All other admin pages that make API calls

### 5. Common Issues

#### Issue: "Failed to fetch" or "NetworkError"
**Solution:**
- Make sure Apache is running
- Check the URL path matches your server setup
- Try accessing the API directly in browser first

#### Issue: "ERR_BLOCKED_BY_CLIENT"
**Solution:**
- Disable browser extensions (ad blockers)
- Try in Incognito/Private mode
- Whitelist localhost in your ad blocker

#### Issue: "404 Not Found"
**Solution:**
- Verify project is in correct htdocs/www folder
- Check folder name matches URL: `gym-management`
- Try: `http://localhost/gym-management/` (should show directory listing or index)

#### Issue: "500 Internal Server Error"
**Solution:**
- Check PHP error logs
- Verify database credentials in `api/config.php`
- Make sure MySQL is running (if using database)

### 6. Alternative: Use Different Port

If you're using a different port (e.g., 8080), update all API URLs:
```javascript
// Change from:
'http://localhost/gym-management/api/adminLogin.php'
// To:
'http://localhost:8080/gym-management/api/adminLogin.php'
```

### 7. Database Setup

The API will automatically create the database and tables on first run. Make sure:
- MySQL/MariaDB is running
- Database credentials in `api/config.php` are correct:
  ```php
  define('DB_HOST', 'localhost');
  define('DB_USER', 'root');
  define('DB_PASS', '');  // Your MySQL password
  define('DB_NAME', 'gym_management');
  ```

### 8. Default Login Credentials

After setup, use:
- **Email:** `admin@gym.com`
- **Password:** `admin123`

## Testing Checklist

- [ ] Apache/PHP server is running
- [ ] Project is in correct htdocs/www folder
- [ ] Can access `http://localhost/gym-management/` in browser
- [ ] Can access `http://localhost/gym-management/api/adminLogin.php` (shows JSON)
- [ ] MySQL is running (if using database)
- [ ] No browser extensions blocking requests
- [ ] React app is running on different port (usually 3000)

