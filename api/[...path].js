// Vercel Serverless Function to proxy API requests to InfinityFree
// This bypasses CORS by making server-to-server requests

export default async function handler(req, res) {
  // Set CORS headers for the Vercel function response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the API endpoint path
  // Vercel catch-all routes: /api/[...path] -> path is in req.query.path as array
  // For /api/adminLogin.php, req.query.path should be ['adminLogin.php']
  let endpoint = '';
  
  // Method 1: Try req.query.path (Vercel catch-all format)
  if (req.query.path) {
    if (Array.isArray(req.query.path)) {
      endpoint = req.query.path.join('/');
    } else if (typeof req.query.path === 'string') {
      endpoint = req.query.path;
    }
  }
  
  // Method 2: Extract from URL directly (fallback)
  if (!endpoint && req.url) {
    // Remove query string and get path
    const urlPath = req.url.split('?')[0];
    // Extract everything after /api/
    const match = urlPath.match(/^\/api\/(.+)$/);
    if (match && match[1]) {
      endpoint = match[1];
    }
  }
  
  // Clean up the endpoint
  endpoint = endpoint.replace(/^\//, ''); // Remove leading slash
  
  if (!endpoint) {
    return res.status(400).json({ 
      error: 'API endpoint is required',
      debug: {
        query: req.query,
        queryPath: req.query.path,
        url: req.url,
        method: req.method,
        endpoint: endpoint
      }
    });
  }

  // Build the InfinityFree API URL
  const apiUrl = `https://fitnessalivegym-api.infinityfree.me/api/${endpoint}`;

  try {
    // Prepare headers - forward relevant headers from the request
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Forward authorization if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    // Get request body - Vercel already parses JSON bodies
    let requestBody = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body) {
        // If body is already a string, use it; otherwise stringify
        if (typeof req.body === 'string') {
          requestBody = req.body;
        } else {
          requestBody = JSON.stringify(req.body);
        }
      }
    }

    // Forward the request to InfinityFree API
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    // Add body for non-GET requests
    if (requestBody) {
      fetchOptions.body = requestBody;
    }

    const response = await fetch(apiUrl, fetchOptions);
    
    // Get response content type
    const contentType = response.headers.get('content-type') || '';
    
    // Handle JSON response
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy request failed', 
      message: error.message 
    });
  }
}

