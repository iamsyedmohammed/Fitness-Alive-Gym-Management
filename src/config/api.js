// API Configuration
// Use Vercel serverless function as proxy to bypass CORS
// Always use /api (relative path) which routes to Vercel serverless function
// This bypasses CORS issues by making same-origin requests
const API_BASE_URL = '/api';

export default API_BASE_URL;

