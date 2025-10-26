import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { getTask, createTask, updateTask, deleteTask, logoutUser } from '../services/api';
import TaskForm from '../components/TaskForm';
import KanbanColumn from '../components/KanbanColumn';
import useTheme from '../hooks/useTheme';

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialColumns = {
    'To Do': [],
    'In Progress': [],
    'Done': [],
  };
  const [columns, setColumns] = useState(initialColumns);

  const [theme, toggleTheme] = useTheme();

  const fetchTasks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getTask();
      const fetchedTasks = response.data;
      setTasks(fetchedTasks);

      const newColumns = {
        'To Do': [],
        'In Progress': [],
        'Done': [],
      };
      fetchedTasks.forEach(task => {
        if (newColumns[task.status]) {
          newColumns[task.status].push(task);
        } else {
          newColumns['To Do'].push(task);
        }
      });

      Object.keys(newColumns).forEach(status => {
        newColumns[status].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });

      setColumns(newColumns);

    } catch (err) {
        console.error('Error fetching tasks:', err);
        if (err.response && err.response.status === 401) {
          handleLogout();
        } else {
           setError('Failed to load tasks. Please try refreshing the page.');
        }
    }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const taskId = parseInt(draggableId);
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const taskToMove = tasks.find(t => t.id === taskId);
    if (!taskToMove) return;

    const newColumnsState = { ...columns };

    const sourceTasks = Array.from(newColumnsState[sourceStatus]);
    sourceTasks.splice(source.index, 1);
    newColumnsState[sourceStatus] = sourceTasks;

    const destTasks = Array.from(newColumnsState[destStatus]);
    const movedTaskUpdated = { ...taskToMove, status: destStatus };
    destTasks.splice(destination.index, 0, movedTaskUpdated);
    newColumnsState[destStatus] = destTasks;

    setColumns(newColumnsState);

    try {
      await updateTask(taskId, { status: destStatus });
       setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status: destStatus } : t));
    } catch (updateError) {
      console.error("Error updating task status:", updateError);
      setError('Failed to update task status. Please refresh.');
       fetchTasks();
    }
  };

   const handleLogout = async () => {
     try {
       await logoutUser();
     } catch (logoutError) { console.error("Logout API error:", logoutError); }
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
        let updatedTask;
        if (editingTask && editingTask.id) {
          const response = await updateTask(editingTask.id, taskData);
          updatedTask = response.data;
          setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        } else {
          const response = await createTask(taskData);
          updatedTask = response.data;
          setTasks(prevTasks => [updatedTask, ...prevTasks]);
        }
        setShowForm(false);
        setEditingTask(null);
        fetchTasks();
      } catch (submitError) {
        console.error('Error saving task:', submitError);
        return Promise.reject(submitError);
      }
      finally { setIsSubmitting(false); }
   };

   const handleDeleteClick = async (taskId) => {
     if (!window.confirm('Are you sure you want to delete this task?')) return;
     try {
       await deleteTask(taskId);
       setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
       fetchTasks();
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-200">
        <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 md:py-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
              Task Board
            </h1>
            <div className="flex items-center space-x-3">

              {/* === Tombol Toggle Tema (Dipindah ke Sini) === */}
              <button
                onClick={toggleTheme}
                // Styling lebih netral
                className="p-2 rounded-md bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors"
                aria-label="Toggle theme"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zM6.464 5.05l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414z" clipRule="evenodd" /></svg>
                )}
              </button>
              {/* === Akhir Tombol Toggle Tema === */}

              {/* Tombol Add Task (Sekarang setelah toggle) */}
              {!showForm && (
                <button
                  onClick={handleAddTaskClick}
                  // Styling diperbarui dengan dark mode
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out text-sm"
                >
                  + Add Task
                </button>
              )}

              {/* Tombol Logout */}
              <button
                onClick={handleLogout}
                // Styling diperbarui dengan dark mode
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {showForm && (
            <div className="mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <TaskForm 
              onSubmit={handleFormSubmit} // <-- PASTIKAN NAMA PROP INI BENAR ('onSubmit')
              initialData={editingTask}
              onCancel={handleFormCancel}
              isLoading={isSubmitting} 
              />
            </div>
          )}

          {isLoading && <p className="text-center text-gray-500 mt-10 text-lg">Loading tasks...</p>}
          {error && <p className="text-center text-red-500 mb-4 mt-10">{error}</p>}

          {!isLoading && !error && (
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-start">
              {Object.entries(columns).map(([status, tasksInColumn]) => (
                <KanbanColumn
                  key={status} title={status} status={status} tasks={tasksInColumn}
                  onEdit={handleEditClick} onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
}

export default DashboardPage;