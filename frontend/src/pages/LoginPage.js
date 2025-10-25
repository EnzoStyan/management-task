// frontend/src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api'; // Impor fungsi login

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State untuk error login
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State untuk pesan sukses dari register
  const navigate = useNavigate();
  const location = useLocation(); // Untuk akses state dari redirect register

  // Cek apakah ada pesan sukses dari halaman register
  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title); // Cara simpel hapus state
    }
  }, [location]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(''); 
    setSuccessMessage(''); 

    const credentials = { email, password };

    try {
      const response = await loginUser(credentials);
      console.log('Login berhasil:', response.data);

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);

        navigate('/dashboard');
      } else {
         setError('Login failed: No token received.');
      }

    } catch (err) {
      if (err.response) {
        console.error('Login error response:', err.response.data);
        if (err.response.status === 401) {
          setError('Invalid email or password.');
        } else if (err.response.status === 422) {
           setError(Object.values(err.response.data).flat().join(' '));
        } else {
           setError(`Login failed: ${err.response.data.message || 'Server error'}`);
        }
      } else {
        console.error('Login error:', err);
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Login to Your Account
        </h1>
        {successMessage && (
            <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                {successMessage}
            </div>
        )}
        {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                {error}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
         <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;