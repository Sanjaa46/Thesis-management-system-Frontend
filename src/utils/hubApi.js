import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Your Laravel backend URL

export const executeHubQuery = async (query, variables = {}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/hub-proxy`,
      {
        query,
        variables
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true // Important for cookies/session
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error executing Hub API query:', error);
    throw error;
  }
};