import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTaskById } from '../services/api'; // Impor fungsi baru

function TaskDetailPage() {
  const { taskId } = useParams(); // Ambil taskId dari URL
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getTaskById(taskId);
        setTask(response.data);
      } catch (err) {
        console.error(`Error fetching task ${taskId}:`, err);
         if (err.response) {
             if (err.response.status === 404) {
                 setError('Task not found.');
             } else if (err.response.status === 403) {
                 setError('You do not have permission to view this task.');
             } else if (err.response.status === 401) {
                 setError('Unauthorized. Redirecting to login...');
                 localStorage.removeItem('token');
                 setTimeout(() => navigate('/login'), 2000);
             } else {
                 setError('Failed to load task details.');
             }
         } else {
            setError('Network error or failed to load task details.');
         }
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId, navigate]); // Tambahkan navigate ke dependency

  const getStatusColor = (status) => {
    if (status === 'Done') return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
    if (status === 'In Progress') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
  };

   const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };


  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 border border-gray-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Task Details</h1>
         <Link to="/dashboard" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            &larr; Back to Board
         </Link>
      </div>

      {loading && <p className="text-gray-500 dark:text-slate-400">Loading task...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {task && !loading && !error && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">{task.title}</h2>
          </div>
           {task.description && (
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Description</label>
                <p className="mt-1 text-gray-700 dark:text-slate-300 whitespace-pre-wrap">{task.description}</p>
             </div>
           )}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Status</label>
                  <span className={`mt-1 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                     {task.status}
                  </span>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Deadline</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{formatDate(task.deadline)}</p>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Created At</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{formatDate(task.created_at)}</p>
               </div>
               {/* Tambahkan info 'created_by' jika backend mengirimnya */}
               {/*
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Created By</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{task.creator?.name || 'Unknown'}</p>
               </div>
               */}
           </div>
           {/* Tombol Edit bisa ditambahkan di sini, arahkan ke form edit */}
           {/* <button onClick={() => navigate(`/edit-task/${task.id}`)} ... >Edit Task</button> */}
        </div>
      )}
    </div>
  );
}

export default TaskDetailPage;