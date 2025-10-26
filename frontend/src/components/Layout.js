import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { logoutUser } from '../services/api';
import useTheme from '../hooks/useTheme';

function Layout() {
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (logoutError) {
      console.error("Logout API error:", logoutError);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200`}>
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;