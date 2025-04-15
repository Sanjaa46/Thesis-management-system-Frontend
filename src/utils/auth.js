// src/utils/auth.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.post(`${API_URL}/oauth/refresh-token`, {
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
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('oauth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('expires_in');
  localStorage.removeItem('token_time');
  window.location.href = '/login';
};

export const isTokenExpired = () => {
  const tokenTime = parseInt(localStorage.getItem('token_time') || '0', 10);
  const expiresIn = parseInt(localStorage.getItem('expires_in') || '3600', 10);
  const currentTime = Math.floor(Date.now() / 1000);
  
  return tokenTime + expiresIn <= currentTime;
};