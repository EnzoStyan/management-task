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
    // Background putih, border, shadow
    <form onSubmit={handleSubmit} className="p-4 bg-white border border-gray-200 rounded-lg space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        {initialData ? 'Edit Task' : 'Add New Task'}
      </h2>
      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
        <input
          type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required
          // Styling input light
          className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900`}
        />
        {errors.title && <p className="mt-1 text-red-500 text-xs">{errors.title[0]}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
          // Styling textarea light
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
        />
         {errors.description && <p className="mt-1 text-red-500 text-xs">{errors.description[0]}</p>}
      </div>
      <div className="flex gap-4">
         <div className="flex-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status" value={status} onChange={(e) => setStatus(e.target.value)}
              // Styling select light
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-gray-900"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
             {errors.status && <p className="mt-1 text-red-500 text-xs">{errors.status[0]}</p>}
         </div>
          <div className="flex-1">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
            />
             {errors.deadline && <p className="mt-1 text-red-500 text-xs">{errors.deadline[0]}</p>}
         </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button" onClick={onCancel} disabled={isLoading}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit" disabled={isLoading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : (initialData ? 'Update Task' : 'Add Task')}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;