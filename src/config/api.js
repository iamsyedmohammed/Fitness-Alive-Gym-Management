// API Configuration
// Use Vercel serverless function as proxy to bypass CORS
// This will route to /api-serverless which proxies to InfinityFree
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export default API_BASE_URL;

