import React, { useState, useEffect } from 'react';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (role: 'customer' | 'admin') => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard />;
}