// src/auth/AuthTest.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      try {
        // Try to set a test cookie
        const setCookieResponse = await axios.get('http://127.0.0.1:8000/api/set-test-cookie', {
          withCredentials: true
        });
        
        // Check if cookie was saved
        const checkCookieResponse = await axios.get('http://127.0.0.1:8000/api/check-test-cookie', {
          withCredentials: true
        });
        
        // Check debug token
        const debugTokenResponse = await axios.get('http://127.0.0.1:8000/api/debug-token', {
          withCredentials: true
        });
        
        // Try user API
        let userResponse = { data: { error: 'Not attempted' } };
        try {
          userResponse = await axios.get('http://127.0.0.1:8000/api/user', {
            withCredentials: true
          });
        } catch (error) {
          userResponse = { data: { error: error.message, status: error.response?.status } };
        }
        
        setTestResults({
          setCookie: setCookieResponse.data,
          checkCookie: checkCookieResponse.data,
          debugToken: debugTokenResponse.data,
          user: userResponse.data
        });
      } catch (error) {
        setTestResults({
          error: error.message,
          details: error.response?.data || 'No response data'
        });
      } finally {
        setLoading(false);
      }
    };
    
    runTests();
  }, []);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      {loading ? (
        <p>Loading tests...</p>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Test Results</h2>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthTest;