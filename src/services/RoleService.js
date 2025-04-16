// src/services/RoleService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

/**
 * Fetches the user's role information from the backend
 * @returns {Promise<Object>} User role data
 */
export const fetchUserRole = async () => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('oauth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get(`${API_URL}/user/role`, {
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error('Failed to fetch role information');
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};

/**
 * Maps a role GID to a readable role name
 * @param {string} gid The group ID from the backend
 * @returns {string} The role name
 */
export const mapGidToRole = (gid) => {
  const roles = {
    '78': 'department',
    '90': 'supervisor',
    '5': 'student',
    '70': 'teacher',
  };
  
  return roles[gid] || 'unknown';
};

/**
 * Determines routes access based on user role
 * @param {string} role User role
 * @returns {Array} List of accessible routes
 */
export const getAccessibleRoutes = (role) => {
  switch (role) {
    case 'department':
      return ['/studentlist', '/deformset'];
    case 'supervisor':
      return ['/proposedtopics', '/approvedtopics'];
    case 'student':
      return ['/topicliststud', '/proposetopicstud', '/confirmedtopic'];
    case 'teacher':
      return ['/topiclist', '/proposetopics', '/confirmedtopics'];
    default:
      return [];
  }
};