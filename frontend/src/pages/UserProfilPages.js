import React, { useState, useEffect } from 'react';
import apiClient from '../services/api'; // Gunakan apiClient langsung atau buat fungsi getMe()
import useTheme from '../hooks/useTheme';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/auth/me'); // Panggil endpoint /me
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError('Failed to load user profile.');
         // Optional: Handle 401 Unauthorized (redirect to login)
         if (err.response && err.response.status === 401) {
             localStorage.removeItem('token');
             window.location.href = '/login'; // Force reload/redirect
         }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 border border-gray-200 dark:border-slate-700">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">User Profile</h1>

      {/* Tombol Theme Toggle di sini juga */}
      <div className="mb-4">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-md bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-sm"
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      {loading && <p className="text-gray-500 dark:text-slate-400">Loading profile...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {user && !loading && !error && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Name</label>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Username</label>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.email}</p>
          </div>
          {/* Tambahkan info lain atau tombol Edit jika perlu */}
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;