// src/oauth.js
import axios from 'axios';
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
    return null;
  }
};

// Function to logout
export const logoutOAuth = async () => {
  localStorage.removeItem('oauth_token');
  return true;
};