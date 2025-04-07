// src/oauth.js
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000"; // Your backend URL

// Function to redirect user to OAuth authorization page
export const redirectToOAuthLogin = () => {
  // Redirect to your backend's OAuth redirect endpoint
  window.location.href = `${API_URL}/oauth/redirect`;
};

// Function to check if user is authenticated via OAuth
export const checkOAuthStatus = async () => {
  try {
    // Use a dedicated endpoint that doesn't redirect but just returns user data
    console.log(localStorage.getItem('token'));
    const response = await axios.get(`${API_URL}/api/user`, {

      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("OAuth status check failed:", error);
    return null;
  }
};

// Function to logout user from OAuth
export const logoutOAuth = async () => {
  try {
    await axios.get(`${API_URL}/oauth/logout`, {
      withCredentials: true
    });
    return true;
  } catch (error) {
    console.error("OAuth logout failed:", error);
    return false;
  }
};