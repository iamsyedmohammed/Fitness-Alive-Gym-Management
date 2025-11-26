# Hostinger Database Setup Guide

## Step 1: Create Database in Hostinger

1. Log in to Hostinger hPanel
2. Go to **Databases** → **MySQL Databases**
3. Create a new database:
   - Database name: `gym_management` (or your preferred name)
   - Click **Create**
4. Create a database user:
   - Username: (create a new user)
   - Password: (set a strong password)
   - Click **Create User**
5. Add user to database:
   - Select the user and database
   - Click **Add**
   - Grant **ALL PRIVILEGES**

## Step 2: Update config.php

Update `api/config.php` with your Hostinger database credentials:

```php
define('DB_HOST', 'localhost');  // Usually 'localhost' for Hostinger
define('DB_USER', 'your_database_username');  // From step 1
define('DB_PASS', 'your_database_password');  // From step 1
define('DB_NAME', 'your_database_name');  // From step 1 (usually: username_dbname)
```

**Important:** Hostinger database names usually follow the pattern: `username_dbname`

## Step 3: Test Database Connection

1. Upload `test-connection.php` to your `api` folder
2. Visit: `https://slateblue-turkey-331136.hostingersite.com/api/test-connection.php`
3. Check the response:
   - If connection successful: You'll see database details
   - If connection failed: Check your credentials

## Step 4: Initialize Database Tables

### Option A: Using test-connection.php

If `admin_table_exists` is `false`, you need to initialize the database:

1. Temporarily uncomment this line in `config.php`:
   ```php
   initializeDatabase();
   ```
2. Visit any API endpoint once (like `adminLogin.php`)
3. Comment it back out:
   ```php
   // initializeDatabase();
   ```

### Option B: Using phpMyAdmin

1. Go to hPanel → **Databases** → **phpMyAdmin**
2. Select your database
3. Go to **SQL** tab
4. Run the SQL from `initializeDatabase()` function in `config.php`

## Step 5: Verify Setup

1. Test connection: `https://slateblue-turkey-331136.hostingersite.com/api/test-connection.php`
2. Should show:
   - `success: true`
   - `admin_table_exists: true`
   - `admin_accounts_count: 1` (or more)

## Default Login Credentials

After initialization:
- **Email:** `admin@gym.com`
- **Password:** `admin123`

## Common Issues

### Issue: "Database connection failed"
**Solutions:**
- Verify database credentials in hPanel
- Check database name format (usually `username_dbname`)
- Make sure user has ALL PRIVILEGES on the database
- Try using `localhost` or the database hostname from hPanel

### Issue: "Table doesn't exist"
**Solutions:**
- Run `initializeDatabase()` once (uncomment in config.php)
- Or manually create tables using phpMyAdmin

### Issue: "Access denied"
**Solutions:**
- Verify username and password are correct
- Make sure user is added to the database
- Check user has proper privileges

## Security Note

After setup, make sure:
- `test-connection.php` is deleted or protected
- Database credentials are secure
- Don't commit `config.php` with real credentials to public repos

