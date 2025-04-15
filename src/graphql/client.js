// src/graphql/client.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Your API base URL

export const executeGraphQLQuery = async (query, variables = {}) => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('oauth_token');
    
    const response = await axios.post(`${API_URL}/hub-proxy`, 
      {
        query,
        variables
      },
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Important for cookie-based authentication
        withCredentials: true
      }
    );
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'GraphQL query failed');
    }
  } catch (error) {
    // Handle auth errors - redirect to login if token expired
    if (error.response && error.response.status === 401) {
      window.location.href = '/login?error=session_expired';
    }
    
    console.error('GraphQL error:', error);
    throw error;
  }
};