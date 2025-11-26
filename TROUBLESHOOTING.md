# Troubleshooting ERR_BLOCKED_BY_CLIENT Error

## What is ERR_BLOCKED_BY_CLIENT?

This error occurs when a browser extension (usually an ad blocker or privacy extension) blocks a network request.

## Solutions

### Solution 1: Disable Browser Extensions (Quick Fix)
1. **Chrome/Edge:**
   - Open browser in Incognito/Private mode (extensions are usually disabled)
   - Or disable extensions temporarily:
     - Go to `chrome://extensions/` or `edge://extensions/`
     - Disable ad blockers (uBlock Origin, AdBlock Plus, etc.)
     - Refresh the page

2. **Firefox:**
   - Open in Private Window
   - Or disable extensions via `about:addons`

### Solution 2: Whitelist Localhost
If using an ad blocker:
- **uBlock Origin:** Click the extension icon → Open dashboard → Go to "My filters" → Add: `@@||localhost^`
- **AdBlock Plus:** Settings → Advanced → Allowlist → Add: `localhost`

### Solution 3: Check API URL Path
The React app is calling: `http://localhost/gym-management/api/adminLogin.php`

**If using XAMPP/WAMP:**
- Make sure the project is in `htdocs/gym-management/`
- The URL should work as-is

**If using a different setup:**
- Update the API URL in `AdminLoginPage.js` to match your server setup
- Example: `http://localhost:8080/gym-management/api/adminLogin.php` (if using a different port)

### Solution 4: Use Relative Paths (Recommended)
Instead of absolute URLs, use relative paths or environment variables:

```javascript
// In AdminLoginPage.js, change:
const response = await fetch('http://localhost/gym-management/api/adminLogin.php', {
  // to:
const response = await fetch('/api/adminLogin.php', {
```

Then configure your development server to proxy API requests.

### Solution 5: Check PHP Server is Running
1. Make sure Apache/PHP server is running
2. Test the API directly in browser: `http://localhost/gym-management/api/adminLogin.php`
3. You should see a JSON response (even if it's an error)

### Solution 6: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try the login again
4. Check if the request appears and what the actual error is

## Most Common Cause
**Browser extensions blocking requests** - Try Solution 1 first (Incognito/Private mode).

