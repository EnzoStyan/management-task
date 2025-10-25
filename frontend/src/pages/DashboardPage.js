import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTask, logoutUser } from '../services/api';


function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchTasks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getTask();
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
       if (err.response && err.response.status === 401) {
         setError('Your session has expired. Please login again.');
         localStorage.removeItem('token');
         setTimeout(() => navigate('/login'), 3000);
       } else {
          setError('Failed to load tasks. Please try refreshing the page.');
       }
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (logoutError) {
            console.error('Logout API error:', logoutError);
        } finally {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Tasks
        </h1>
        <button
          onClick={handleLogout} // Gunakan fungsi handleLogout
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>

      {/* Tombol Add Task (akan difungsikan nanti) */}
      <div className="mb-4">
         <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
            + Add New Task
         </button>
      </div>

      {/* Filter & Sort (akan difungsikan nanti) */}
      {/* <div className="mb-4 flex space-x-4"> ... </div> */}

      {/* Tampilkan Loading, Error, atau Daftar Task */}
      {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Loading tasks...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.task_id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400 truncate">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {task.description || 'No description'}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex flex-col items-end space-y-1">
                       <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.status === 'Done'
                              ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                              : task.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100' // To Do
                          }`}
                        >
                          {task.status}
                        </span>
                        {task.deadline && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                               Due: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                        )}
                        {/* Tombol Edit & Delete (akan difungsikan nanti) */}
                        <div className="flex space-x-2 mt-1">
                           <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 text-xs">Edit</button>
                           <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 text-xs">Delete</button>
                        </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
                You have no tasks yet. Add one!
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;