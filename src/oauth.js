// src/oauth.js
import api from './api/axios';

// Base URL for your backend
const API_BASE_URL = 'http://127.0.0.1:8000';

// Function to redirect to OAuth login
export const redirectToOAuthLogin = () => {
  window.location.href = `${API_BASE_URL}/oauth/redirect`;
};

// Function to check OAuth status
export const checkOAuthStatus = async () => {
  try {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('oauth_token');
    
    if (!token) {
      return null;
    }
    
    // Check if the token is expired
    const tokenTime = parseInt(localStorage.getItem('token_time') || '0', 10);
    const expiresIn = parseInt(localStorage.getItem('expires_in') || '3600', 10);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // If token is expired or about to expire in the next 5 minutes, try to refresh it
    if (tokenTime + expiresIn - currentTime < 300) {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const response = await api.post('/api/oauth/refresh-token', {
            refresh_token: refreshToken
          });
          
          if (response.data && response.data.access_token) {
            // Update tokens in localStorage
            localStorage.setItem('oauth_token', response.data.access_token);
            
            if (response.data.refresh_token) {
              localStorage.setItem('refresh_token', response.data.refresh_token);
            }
            
            localStorage.setItem('expires_in', response.data.expires_in.toString());
            localStorage.setItem('token_time', response.data.token_time.toString());
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // If refresh fails, clear tokens and return null
          localStorage.removeItem('oauth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('expires_in');
          localStorage.removeItem('token_time');
          return null;
        }
      } else {
        // No refresh token available
        localStorage.removeItem('oauth_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('token_time');
        return null;
      }
    }
    
    // Make a request to the user endpoint
    const response = await api.get('/api/user');
    
    if (response.status === 200 && response.data) {
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('OAuth status check failed:', error);
    // Clear token if it's invalid
    localStorage.removeItem('oauth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('token_time');
    return null;
  }
};

// Function to logout
export const logoutOAuth = async () => {
  localStorage.removeItem('oauth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('expires_in');
  localStorage.removeItem('token_time');
  return true;
};