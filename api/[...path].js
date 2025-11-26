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
  const { path } = req.query;
  const endpoint = Array.isArray(path) ? path.join('/') : path || '';
  
  if (!endpoint) {
    return res.status(400).json({ error: 'API endpoint is required' });
  }

  // Build the InfinityFree API URL
  const apiUrl = `https://fitnessalivegym-api.infinityfree.me/api/${endpoint}`;

  try {
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Forward authorization if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    // Forward the request to InfinityFree API
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    // Add body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
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

