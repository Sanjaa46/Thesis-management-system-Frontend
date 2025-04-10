// OAuthCallback.js (modified)
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the authorization code from URL
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        console.log('OAuthCallback - URL search params:', location.search);
        console.log('OAuthCallback - Code from URL:', code);
        
        if (!code) {
          setError('No authorization code found in URL');
          setStatus('Authorization failed. Redirecting to login...');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        // Exchange code for tokens via your backend
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/oauth/token', {
            code: code,
            state: state
          });
          
          console.log('Token response:', response.data);
          
          if (response.data.access_token) {
            // Store tokens in localStorage
            localStorage.setItem('oauth_token', response.data.access_token);
            
            if (response.data.refresh_token) {
              localStorage.setItem('refresh_token', response.data.refresh_token);
            }
            
            localStorage.setItem('expires_in', response.data.expires_in.toString());
            localStorage.setItem('token_time', response.data.token_time.toString());
            
            // Get user info
            const userResponse = await axios.get('http://127.0.0.1:8000/api/user', {
              headers: {
                'Authorization': `Bearer ${response.data.access_token}`
              }
            });
            
            setUser(userResponse.data);
            setStatus('Authentication successful! Redirecting...');
            setTimeout(() => navigate('/'), 1000);
          } else {
            throw new Error('Invalid token response');
          }
        } catch (exchangeError) {
          console.error('Token exchange error:', exchangeError);
          setError(`Token exchange failed: ${exchangeError.message}`);
          setStatus('Authentication failed. Redirecting to login...');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        setError(`General error: ${error.message}`);
        setStatus(`Authentication failed. Redirecting to login...`);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processCallback();
  }, [navigate, location, setUser]);

  // JSX remains the same
};

export default OAuthCallback;