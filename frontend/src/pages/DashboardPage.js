import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTask, createTask, updateTask, deleteTask, logoutUser } from '../services/api';
import TaskForm from '../components/TaskForm';
import useTheme from '../hooks/useTheme';
import { FiArrowDown, FiArrowUp, FiMoon, FiSun } from 'react-icons/fi';

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, toggleTheme] = useTheme();

  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  const fetchTasks = async () => {
    setError('');
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (sortBy) {
        params.sort_by = sortBy;
        params.sort_dir = sortDir;
      }
      console.log('Fetching tasks with params:', params);
      const response = await getTask(params);
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
    // Re-fetch only if not initial loading
    if (!isLoading) {
       fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, sortBy, sortDir]);


  const handleLogout = async () => {
    try { await logoutUser(); }
    catch (logoutError) { console.error("Logout API error:", logoutError); }
    finally {
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
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      setShowForm(false);
      setEditingTask(null);
      await fetchTasks(); // Fetch ulang setelah submit
    } catch (submitError) {
      console.error('Error saving task:', submitError);
       return Promise.reject(submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskId);
      await fetchTasks(); // Fetch ulang setelah delete
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    if (status === 'Done') return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
    if (status === 'In Progress') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 md:py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
            Task List
          </h1>
          <div className="flex items-center space-x-3">
             <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
            </button>
            {!showForm && (
              <button
                onClick={handleAddTaskClick}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out text-sm"
              >
                + Add Task
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
            <TaskForm
              onSubmit={handleFormSubmit}
              initialData={editingTask}
              onCancel={handleFormCancel}
              isLoading={isSubmitting}
            />
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-gray-200 dark:border-slate-700">
          <div>
            <label htmlFor="filterStatus" className="mr-2 text-sm font-medium text-gray-700 dark:text-slate-300">
              Filter:
            </label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => { setIsLoading(true); setFilterStatus(e.target.value); }}
              className="p-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <span className="mr-2 text-sm font-medium text-gray-700 dark:text-slate-300">Sort by:</span>
            <button
              onClick={() => {
                setIsLoading(true);
                if (sortBy === 'deadline') { setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }
                else { setSortBy('deadline'); setSortDir('asc'); }
              }}
              className={`px-3 py-1 mr-2 border rounded text-sm transition-colors ${
                sortBy === 'deadline'
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                  : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600'
              }`}
            >
              Deadline {sortBy === 'deadline' ? (sortDir === 'asc' ? <FiArrowUp className="inline ml-1 h-3 w-3"/> : <FiArrowDown className="inline ml-1 h-3 w-3"/>) : ''}
            </button>
             <button
              onClick={() => {
                setIsLoading(true);
                if (sortBy === 'created_at') { setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }
                else { setSortBy('created_at'); setSortDir('desc'); }
              }}
               className={`px-3 py-1 border rounded text-sm transition-colors ${
                sortBy === 'created_at'
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                  : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600'
              }`}
            >
              Created Date {sortBy === 'created_at' ? (sortDir === 'asc' ? <FiArrowUp className="inline ml-1 h-3 w-3"/> : <FiArrowDown className="inline ml-1 h-3 w-3"/>) : ''}
            </button>
          </div>
        </div>


        {isLoading && <p className="text-center text-gray-500 dark:text-slate-400 mt-10 text-lg">Loading tasks...</p>}
        {error && <p className="text-center text-red-500 mb-4 mt-10">{error}</p>}

        {!isLoading && !error && (
          <div className="bg-white dark:bg-slate-800 shadow-md overflow-hidden sm:rounded-lg border border-gray-200 dark:border-slate-700">
            <ul className="divide-y divide-gray-200 dark:divide-slate-700">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition duration-150 ease-in-out">
                    <div className="flex items-center justify-between">
                      <div className="truncate flex-1 min-w-0">
                         <Link to={`/tasks/${task.id}`} className="block group">
                           <p className="text-md font-medium text-indigo-600 dark:text-indigo-400 truncate group-hover:underline">{task.title}</p>
                         </Link>
                        <p className="text-sm text-gray-600 dark:text-slate-400 truncate mt-1">{task.description || ''}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                         <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {task.deadline && (
                            <p className="text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap hidden sm:block">
                               Due: {formatDate(task.deadline)}
                            </p>
                          )}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(task)}
                            className="text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
                            aria-label="Edit Task" title="Edit Task"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(task.id)}
                            className="text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
                            aria-label="Delete Task" title="Delete Task"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 sm:px-6 text-center text-gray-500 dark:text-slate-400">
                  You have no tasks yet. Add one!
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;