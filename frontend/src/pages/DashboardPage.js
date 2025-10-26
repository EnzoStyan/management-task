import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTask, createTask, updateTask, deleteTask, logoutUser } from '../services/api'; // Pastikan 'getTask' (singular) diimpor
import TaskForm from '../components/TaskForm';

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  const fetchTasks = async () => {
    setError('');
    try {
      const params = {};
      if (filterStatus) {
        params.status = filterStatus;
      }
      if (sortBy) {
        params.sort_by = sortBy;
        params.sort_dir = sortDir;
      }
      console.log('Fetching tasks with params:', params); // Keep for debugging
      const response = await getTask(params); // Gunakan 'getTask' (singular)
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      } else {
        setError('Failed to load tasks. Please try refreshing the page.');
      }
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, sortBy, sortDir]);

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

  const handleAddTaskClick = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSubmit = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask && editingTask.id) {
        const response = await updateTask(editingTask.id, taskData);
        setTasks(tasks.map(t => t.id === editingTask.id ? response.data : t));
      } else {
        const response = await createTask(taskData);
        setTasks([response.data, ...tasks]);
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (submitError) {
      console.error('Error saving task:', submitError);
       return Promise.reject(submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (deleteError) {
      console.error('Error deleting task:', deleteError);
      if (deleteError.response && deleteError.response.status === 401) {
        handleLogout();
      } else {
        setError('Failed to delete task. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Tasks
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TaskForm
            onSubmit={handleFormSubmit}
            initialData={editingTask}
            onCancel={handleFormCancel}
            isLoading={isSubmitting}
          />
        </div>
      )}

      {!showForm && (
        <div className="mb-4">
          <button
            onClick={handleAddTaskClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            + Add New Task
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <div>
          <label htmlFor="filterStatus" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Status:
          </label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div>
          <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
          <button
            onClick={() => {
              if (sortBy === 'deadline') {
                setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('deadline');
                setSortDir('asc');
              }
            }}
            className={`px-3 py-1 mr-2 border rounded text-sm ${
              sortBy === 'deadline'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                : 'bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'
            }`}
          >
            Deadline {sortBy === 'deadline' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </button>
           <button
            onClick={() => {
              if (sortBy === 'created_at') {
                setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('created_at');
                setSortDir('desc');
              }
            }}
             className={`px-3 py-1 border rounded text-sm ${
              sortBy === 'created_at'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                : 'bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'
            }`}
          >
            Created Date {sortBy === 'created_at' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>


      {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Loading tasks...</p>}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {!isLoading && !error && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400 truncate">{task.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{task.description || 'No description'}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex flex-col items-end space-y-1">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === 'Done'
                            ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                            : task.status === 'In Progress'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
                        }`}
                      >
                        {task.status}
                      </span>
                      {task.deadline && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                           Due: {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex space-x-2 mt-1">
                        <button
                          onClick={() => handleEditClick(task)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(task.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 text-xs font-medium"
                        >
                          Delete
                        </button>
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