# Hostinger Deployment Guide

## Your Domain
**https://slateblue-turkey-331136.hostingersite.com/**

## Step-by-Step Deployment

### Step 1: Build Your React App

```bash
npm run build
```

This creates a `build` folder with all production files.

### Step 2: Access Hostinger File Manager

1. Log in to your Hostinger control panel (hPanel)
2. Go to **File Manager**
3. Navigate to `public_html` folder (this is your website root)

### Step 3: Upload Files

1. **Delete old files** (if any) from `public_html`
2. **Upload all files** from your local `build` folder to `public_html`
   - You can upload via File Manager or use FTP
   - Make sure to upload **all files and folders** including:
     - `index.html`
     - `.htaccess` (important!)
     - `static/` folder
     - All other files

### Step 4: Verify .htaccess File

1. In File Manager, make sure `.htaccess` is visible
   - If you don't see it, enable "Show Hidden Files" in File Manager settings
2. The `.htaccess` file should be in the same directory as `index.html`
3. Verify the content (should match the one in `public/.htaccess`)

### Step 5: Set File Permissions (if needed)

If you're using FTP or having issues:
- Files: `644` permissions
- Folders: `755` permissions
- `.htaccess`: `644` permissions

### Step 6: Test Your Site

1. Visit: `https://slateblue-turkey-331136.hostingersite.com/`
2. Navigate to `/admin/login`
3. Login
4. Navigate to different pages like `/admin`, `/admin/trainers`
5. **Refresh the page** - it should work now!

## Updating API URLs for Production

Since your site is now on Hostinger, you need to update API URLs.

### Option 1: Update All API URLs

Search and replace in all admin pages:
- From: `http://localhost/gym-management/api/`
- To: `https://slateblue-turkey-331136.hostingersite.com/api/`

Files to update:
- `src/pages/AdminLoginPage.js`
- `src/pages/Admin/AdminDashboard.js`
- `src/pages/Admin/TrainersManagementPage.js`
- `src/pages/Admin/MembersManagementPage.js`
- All other admin pages

### Option 2: Use Environment Variables (Recommended)

1. Create `.env.production` file in root:
```env
REACT_APP_API_URL=https://slateblue-turkey-331136.hostingersite.com/api
```

2. Create a helper file `src/config/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/gym-management/api';

export default API_BASE_URL;
```

3. Update all API calls to use:
```javascript
import API_BASE_URL from '../config/api';

fetch(`${API_BASE_URL}/adminLogin.php`, { ... })
```

## Uploading PHP API Files

1. Create an `api` folder in `public_html`
2. Upload all PHP files from your local `api` folder to `public_html/api/`
3. Make sure `config.php` has correct database credentials

## Troubleshooting

### Issue: Still getting 404 on refresh
**Solutions:**
1. Verify `.htaccess` is in `public_html` root (same level as `index.html`)
2. Check if `.htaccess` is visible (enable "Show Hidden Files")
3. Verify file permissions (should be 644)
4. Contact Hostinger support to ensure `mod_rewrite` is enabled

### Issue: .htaccess not working
Try this alternative `.htaccess` content:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Issue: API calls not working
**Solutions:**
1. Make sure API files are uploaded to `public_html/api/`
2. Update all API URLs to use your domain
3. Check CORS headers in PHP files
4. Test API directly: `https://slateblue-turkey-331136.hostingersite.com/api/adminLogin.php`

### Issue: Assets (CSS/JS) not loading
**Solutions:**
1. Make sure you uploaded the entire `build` folder contents
2. Check file permissions
3. Verify paths in `index.html` are correct

## Quick Checklist

- [ ] Built app with `npm run build`
- [ ] Uploaded all files from `build` to `public_html`
- [ ] Verified `.htaccess` is in root directory
- [ ] Updated all API URLs to production domain
- [ ] Uploaded PHP API files to `public_html/api/`
- [ ] Tested navigation and refresh on all routes
- [ ] Verified assets are loading correctly

## Need Help?

If issues persist:
1. Check Hostinger error logs in hPanel
2. Contact Hostinger support (mention you're hosting a React SPA)
3. Verify `mod_rewrite` is enabled on your hosting plan

