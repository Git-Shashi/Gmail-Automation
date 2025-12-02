import axios from 'axios';
import { API_V1_URL } from '../lib/constants';

const TOKEN_KEY = 'gmail_auth_token';
const USER_KEY = 'gmail_user';

// Axios instance with auth interceptor
const api = axios.create({
  baseURL: API_V1_URL,
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Login - Get Google OAuth authorization URL and redirect
export const login = async () => {
  try {
    const response = await axios.get(`${API_V1_URL}/auth/login`);
    return response.data;
  } catch (error) {
    console.error('Failed to get auth URL:', error);
    throw error;
  }
};

// Get Google OAuth authorization URL
export const getAuthUrl = async () => {
  try {
    const response = await axios.get(`${API_V1_URL}/auth/login`);
    return response.data.authorization_url;
  } catch (error) {
    console.error('Failed to get auth URL:', error);
    throw error;
  }
};

// Exchange OAuth code for token (called by backend redirect)
export const handleCallback = async (code) => {
  try {
    const response = await axios.get(`${API_V1_URL}/auth/callback`, {
      params: { code }
    });
    
    const { access_token, user } = response.data;
    
    // Store token and user info
    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return { access_token, user };
  } catch (error) {
    console.error('OAuth callback failed:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    const user = response.data;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout request failed:', error);
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get user from localStorage
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

export default api;
