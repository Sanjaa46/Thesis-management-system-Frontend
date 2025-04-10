import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the temporary token from URL
        const params = new URLSearchParams(location.search);
        const tempToken = params.get('token');
        
        if (!tempToken) {
          setStatus('No authentication token found. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        // Exchange the temporary token for user data and access token
        const response = await axios.post('http://127.0.0.1:8000/api/exchange-token', {
          token: tempToken
        });
        
        if (response.data && response.data.user && response.data.access_token) {
          // Store the access token in localStorage
          localStorage.setItem('oauth_token', response.data.access_token);
          
          // Update user context
          setUser(response.data.user);
          
          setStatus('Authentication successful! Redirecting...');
          setTimeout(() => navigate('/'), 1000);
        } else {
          throw new Error('Invalid response from token exchange');
        }
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        setStatus('Authentication failed. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    processCallback();
  }, [navigate, location, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">{status}</h2>
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
};

export default OAuthCallback;