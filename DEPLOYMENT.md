# Deployment Guide - Fix 404 Errors on Refresh

## Problem
When you refresh a page on routes like `/admin`, `/admin/trainers`, etc., you get a 404 error. This happens because the server tries to find a file at that path, but React Router handles routing on the client side.

## Solution
Configure your server to redirect all routes to `index.html` so React Router can handle the routing.

## Step 1: Build Your React App

```bash
npm run build
```

This creates a `build` folder with your production files.

## Step 2: Upload Files

Upload the contents of the `build` folder (not the folder itself) to your web server's root directory (usually `public_html`, `www`, or `htdocs`).

## Step 3: Configure Server Based on Your Hosting

### Option A: Apache Server (.htaccess)

If you're using Apache (most shared hosting), the `.htaccess` file is already created in the `public` folder. After building, it will be in your `build` folder.

**Make sure:**
1. The `.htaccess` file is in your root directory (same level as `index.html`)
2. Your hosting provider allows `.htaccess` files
3. `mod_rewrite` is enabled on your server

**If `.htaccess` doesn't work, try this alternative:**

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Option B: Nginx Server

If you're using Nginx, add this to your server configuration:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Or use the `nginx.conf` file provided in the `public` folder and copy it to your Nginx configuration.

### Option C: IIS Server (Windows)

If you're using IIS (Windows hosting), the `web.config` file is already created. Make sure it's in your root directory.

### Option D: Netlify / Vercel / Other Static Hosting

For Netlify, the `_redirects` file is already created. For Vercel, create a `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Option E: cPanel / Shared Hosting

1. Upload your `build` folder contents to `public_html`
2. Make sure `.htaccess` file is uploaded
3. If `.htaccess` doesn't work, contact your hosting provider to enable `mod_rewrite`

## Step 4: Update API URLs for Production

After deployment, you need to update API URLs in your React app to point to your production API.

### Option 1: Use Environment Variables

Create a `.env.production` file:

```env
REACT_APP_API_URL=https://yourdomain.com/api
```

Then update your API calls to use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost/gym-management/api';
```

### Option 2: Update All API URLs Manually

Search and replace in all admin pages:
- From: `http://localhost/gym-management/api/`
- To: `https://yourdomain.com/api/`

## Step 5: Test

1. Visit your domain: `https://yourdomain.com`
2. Navigate to `/admin/login`
3. Login
4. Navigate to different admin pages
5. **Refresh the page** - it should work now!

## Common Issues

### Issue: Still getting 404 after adding .htaccess
**Solutions:**
- Make sure `.htaccess` is in the root directory (same level as `index.html`)
- Check if your hosting provider allows `.htaccess` files
- Verify `mod_rewrite` is enabled (contact hosting support)
- Try the alternative `.htaccess` configuration above

### Issue: API calls not working
**Solutions:**
- Update API URLs to use your production domain
- Check CORS settings in your PHP API files
- Verify your API is accessible at the new URL

### Issue: Assets (CSS/JS) not loading
**Solutions:**
- Make sure you uploaded the entire `build` folder contents
- Check file permissions (should be 644 for files, 755 for folders)
- Verify paths in `index.html` are correct (should be relative paths)

## Quick Checklist

- [ ] Built the app with `npm run build`
- [ ] Uploaded all files from `build` folder to server
- [ ] Added appropriate server configuration (`.htaccess`, `web.config`, or nginx config)
- [ ] Updated API URLs to production domain
- [ ] Tested navigation and refresh on all routes
- [ ] Verified assets are loading correctly

## Need Help?

If you're still having issues:
1. Check your hosting provider's documentation for SPA (Single Page Application) setup
2. Contact your hosting support and mention you're hosting a React SPA
3. Check server error logs for more details

