// API Configuration
// Use Vercel serverless function as proxy to bypass CORS
// In production: uses /api (Vercel serverless function)
// In development: can use direct InfinityFree URL or local proxy
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'https://fitnessalivegym-api.infinityfree.me/api');

export default API_BASE_URL;

