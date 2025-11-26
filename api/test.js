// Simple test endpoint to verify serverless function is working
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  return res.status(200).json({
    success: true,
    message: 'Serverless function is working!',
    method: req.method,
    query: req.query,
    url: req.url,
    body: req.body
  });
}

