# Hostinger Database Setup Guide

## Step 1: Create Database in Hostinger

1. Log in to your **Hostinger hPanel**
2. Go to **Databases** → **MySQL Databases**
3. Click **Create New Database**
4. Database name should be: `u186820425_gym_mgm_db`
5. Click **Create**

## Step 2: Create Database User (if not already created)

1. In the same MySQL Databases section
2. Scroll to **MySQL Users**
3. Create a new user:
   - Username: `u186820425_gym_management`
   - Password: `GymOrg@2025`
4. Click **Create User**

## Step 3: Assign User to Database

1. Scroll to **Add User to Database**
2. Select:
   - User: `u186820425_gym_management`
   - Database: `u186820425_gym_mgm_db`
3. Check **ALL PRIVILEGES**
4. Click **Add**

## Step 4: Verify Database Host

The database host for Hostinger is usually:
- **Host:** `localhost` (NOT your website domain)

## Step 5: Upload Files

1. Upload all files from the `api` folder to: `public_html/api/` (or your domain's root)
2. Make sure `config.php` has these settings:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'u186820425_gym_management');
   define('DB_PASS', 'GymOrg@2025');
   define('DB_NAME', 'u186820425_gym_mgm_db');
   ```

## Step 6: Test Connection

Visit: `https://slateblue-turkey-331136.hostingersite.com/api/simple-test.php`

This will show you:
- If MySQL server connection works
- If database exists
- If tables are created

## Troubleshooting

### Error: "Database does not exist"
- Make sure you created the database in Step 1
- Database name must match exactly: `u186820425_gym_mgm_db`

### Error: "Access denied"
- Check username and password match exactly
- Make sure user has ALL PRIVILEGES on the database

### Error: "Cannot connect to MySQL server"
- Try changing `DB_HOST` from `localhost` to your actual database hostname
- Check in Hostinger hPanel → Databases → MySQL Databases for the correct hostname
- Sometimes it's shown as `localhost` or a specific server name

### Still getting 500 error?
1. Check Hostinger error logs in hPanel
2. Visit `simple-test.php` to see detailed error messages
3. Make sure PHP version is 7.4 or higher

