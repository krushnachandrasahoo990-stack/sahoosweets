import React, { useState, useEffect } from 'react';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('isAuthenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [userRole, setUserRole] = useState<'customer' | 'admin'>(() => {
    try {
      const stored = localStorage.getItem('userRole');
      return stored === 'admin' ? 'admin' : 'customer';
    } catch {
      return 'customer';
    }
  });

  useEffect(() => {
    try {
      const auth = localStorage.getItem('isAuthenticated');
      const role = localStorage.getItem('userRole');
      if (auth === 'true') {
        setIsAuthenticated(true);
        setUserRole(role === 'admin' ? 'admin' : 'customer');
      } else {
        setIsAuthenticated(false);
      }
    } catch {}
  }, []);

  const handleLoginSuccess = (role: 'customer' | 'admin') => {
    try {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
    } catch {}
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userPhone');
    } catch {}
    setIsAuthenticated(false);
    setUserRole('customer');
  };

  // Strict Role-Based Access: Only Admin is permitted to toggle between Admin and Customer Storefront
  const handleSwitchRole = (newRole: 'customer' | 'admin') => {
    if (userRole !== 'admin') return;
    try {
      localStorage.setItem('userRole', newRole);
    } catch {}
    setUserRole(newRole);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Dashboard 
      userRole={userRole} 
      onLogout={handleLogout} 
      onSwitchRole={userRole === 'admin' ? handleSwitchRole : undefined} 
    />
  );
}
