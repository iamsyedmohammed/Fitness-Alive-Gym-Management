# Quick Setup Guide - Fix 500 Error

## The Problem
You're getting a 500 error because the database doesn't exist yet. The code will create it automatically, but you need to set up database credentials first.

## Step 1: Create Database in Hostinger (2 minutes)

1. **Log in to Hostinger hPanel**
2. Go to **Databases** → **MySQL Databases**
3. **Create a new database:**
   - Database name: `gym_management` (or any name you prefer)
   - Click **Create**
4. **Create a database user:**
   - Username: (create a new user, e.g., `gym_user`)
   - Password: (set a strong password)
   - Click **Create User**
5. **Add user to database:**
   - Select your user and database
   - Click **Add**
   - Grant **ALL PRIVILEGES**

## Step 2: Update config.php

Open `api/config.php` and update these lines with your Hostinger database details:

```php
define('DB_HOST', 'localhost');  // Usually 'localhost' for Hostinger
define('DB_USER', 'your_hostinger_db_username');  // From step 1
define('DB_PASS', 'your_hostinger_db_password');  // From step 1
define('DB_NAME', 'your_hostinger_db_name');  // Usually: username_dbname
```

**Important:** Hostinger database names usually follow this pattern:
- If your Hostinger username is `u123456789` and you named the database `gym_management`
- The full database name will be: `u123456789_gym_management`

## Step 3: Upload Updated Files

1. Upload the updated `api/config.php` with your credentials
2. Upload all other API files
3. The code will automatically create tables on first run

## Step 4: Test

1. Try logging in again
2. The database and tables will be created automatically
3. Default login: `admin@gym.com` / `admin123`

## If You Still Get 500 Error

1. **Upload `debug.php`** to your `api` folder
2. Visit: `https://slateblue-turkey-331136.hostingersite.com/api/debug.php`
3. Check the output - it will show exactly what's wrong
4. Common issues:
   - Wrong database credentials
   - Database name format incorrect (should be `username_dbname`)
   - User doesn't have permissions

## Quick Checklist

- [ ] Created database in Hostinger hPanel
- [ ] Created database user in Hostinger
- [ ] Added user to database with ALL PRIVILEGES
- [ ] Updated `config.php` with correct credentials
- [ ] Uploaded updated `config.php` to Hostinger
- [ ] Tested login (database will auto-create tables)

## Need Your Database Details?

If you're not sure about your database credentials:
1. Go to Hostinger hPanel → Databases → MySQL Databases
2. You'll see your database name, username, and can reset password if needed
3. The database host is usually `localhost`

