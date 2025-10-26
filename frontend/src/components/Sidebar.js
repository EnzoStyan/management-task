import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ onLogout }) {
  const location = useLocation();

  const linkClasses = "flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-300 transition-colors duration-200 transform rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200";
  const activeLinkClasses = "flex items-center px-4 py-2 mt-2 text-gray-700 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 rounded-md";

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Task Manager
        </h2>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link
          to="/dashboard"
          className={location.pathname === '/dashboard' ? activeLinkClasses : linkClasses}
        >
          <span className="mx-4 font-medium">Dashboard</span>
        </Link>

        <Link
          to="/profile"
          className={location.pathname === '/profile' ? activeLinkClasses : linkClasses}
        >
          <span className="mx-4 font-medium">Profile</span>
        </Link>
      </nav>

      <div className="px-2 py-4 border-t border-gray-200 dark:border-slate-700">
         <button
            onClick={onLogout}
            className={`${linkClasses} w-full text-left`}
          >
            <span className="mx-4 font-medium">Logout</span>
          </button>
      </div>
    </aside>
  );
}

export default Sidebar;