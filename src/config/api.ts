// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://your-backend-app-name.onrender.com' // Replace with your actual backend domain
    : 'http://localhost:3001'
  );

export const API_ENDPOINTS = {
  POSTS: `${API_BASE_URL}/api/posts`,
  COMMENTS: `${API_BASE_URL}/api/comments`,
  MARQUEES: `${API_BASE_URL}/api/marquees`,
  POLLS: `${API_BASE_URL}/api/polls`,
  BLOCKED_USERS: `${API_BASE_URL}/api/blocked-users`,
  ADMIN_UPDATES: `${API_BASE_URL}/api/admin-updates`,
  ADMINS: `${API_BASE_URL}/api/admins`,
  LOGIN: `${API_BASE_URL}/api/login`,
};

export default API_BASE_URL;
