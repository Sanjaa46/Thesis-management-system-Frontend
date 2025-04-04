import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Main from "./modules/Main";
import OAuthCallback from "./auth/OAuthCallback";
import { checkOAuthStatus, logoutOAuth } from "./oauth";
import { UserProvider, useUser } from "./context/UserContext";
import AuthSuccess from "./auth/AuthSuccess";

function AppContent() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      const userData = await checkOAuthStatus();
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
  }, [setUser]);

  if (loading) {
    return <div className="font-bold text-center text-5xl">loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/*" element={user ? <Main setUser={setUser} logoutFunction={logoutOAuth} /> : <Navigate to="/login" />} />
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