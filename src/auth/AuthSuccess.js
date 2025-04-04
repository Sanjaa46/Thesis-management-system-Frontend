import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkOAuthStatus } from '../oauth';
import { useUser } from '../context/UserContext';

const AuthSuccess = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await checkOAuthStatus();
      if (userData) {
        setUser(userData);
        navigate('/');
      } else {
        navigate('/login');
      }
    };

    checkAuth();
  }, [setUser, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-500"></div>
    </div>
  );
};

export default AuthSuccess;