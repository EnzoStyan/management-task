// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/Layout';
import UserProfilePage from './pages/UserProfilPages';
import TaskDetailPage from './pages/TaskDetailPage';
import './index.css';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900"> {/* Contoh: bg-gray-50 */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
          >
            <Route index element={<Navigate to="/dashboard" replace />} /> {/* Redirect '/' ke '/dashboard' */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="tasks/:taskId" element={<TaskDetailPage />} />
          </Route>
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<div className="p-10 text-center">404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;