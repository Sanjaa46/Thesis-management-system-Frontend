// src/auth/OAuthCallback.js
import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data using cookies that were set during OAuth callback
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          withCredentials: true
        });
        
        if (response.data) {
          setUser(response.data);
          navigate('/');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [setUser, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-500"></div>
    </div>
  );
};

export default OAuthCallback;