// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Main from "./modules/Main";
import OAuthCallback from "./auth/OAuthCallback";
import { checkOAuthStatus, logoutOAuth } from "./oauth";
import { UserProvider, useUser } from "./context/UserContext";
import AuthSuccess from "./auth/AuthSuccess";
import AuthTest from "./auth/AuthTest";

function AppContent() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkAuth = async () => {
      setLoading(true);
      try {
        const userData = await checkOAuthStatus();
        console.log("User data: ", userData);
        setUser(userData);
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-2xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login setAuthState={() => {}} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register setAuthState={() => {}} setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/auth" element={<OAuthCallback />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/auth-test" element={<AuthTest />} />
        <Route path="/*" element={user ? <Main user={user} setUser={setUser} logoutFunction={logoutOAuth} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;