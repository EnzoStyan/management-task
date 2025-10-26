import React, { useState, useEffect } from 'react';

function TaskForm({ onSubmit, initialData = null, onCancel, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'To Do');
      setDeadline(initialData.deadline ? initialData.deadline.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setDeadline('');
    }
    setErrors({});
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({}); 

    if (!title) {
      setErrors({ title: ['The title field is required.'] });
      return;
    }

    const taskData = {
      title,
      description,
      status,
      deadline: deadline || null, 
    };
    onSubmit(taskData).catch(err => {
        if (err.response && err.response.status === 422) {
            setErrors(err.response.data.errors || err.response.data); 
             setErrors({ general: 'An unexpected error occurred.' });
        }
        throw err;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-50 dark:bg-gray-700 space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Task' : 'Add New Task'}
      </h2>
      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-white`}
        />
        {errors.title && <p className="mt-1 text-red-500 text-xs">{errors.title[0]}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-white"
        />
         {errors.description && <p className="mt-1 text-red-500 text-xs">{errors.description[0]}</p>}
      </div>
      <div className="flex gap-4">
         <div className="flex-1">
            <label htmlFor="status" className="block text-sm font-medium">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-white"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
             {errors.status && <p className="mt-1 text-red-500 text-xs">{errors.status[0]}</p>}
         </div>
          <div className="flex-1">
            <label htmlFor="deadline" className="block text-sm font-medium">Deadline</label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-white"
            />
             {errors.deadline && <p className="mt-1 text-red-500 text-xs">{errors.deadline[0]}</p>}
         </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button" 
          onClick={onCancel}
          disabled={isLoading}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-500 hover:bg-gray-50 dark:hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : (initialData ? 'Update Task' : 'Add Task')}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;