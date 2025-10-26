// frontend/src/components/TaskCard.js
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

function TaskCard({ task, index, onEdit, onDelete }) {

  const getBorderColorClass = () => {
    if (task.status === 'Done') return 'border-green-500';
    if (task.status === 'In Progress') return 'border-yellow-500';
    return 'border-slate-300'; // Default light
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // Background putih, border, shadow, hover
          className={`group mb-2 p-3 bg-white rounded-md border ${getBorderColorClass()} border-l-4 shadow-sm hover:shadow-lg hover:border-l-indigo-500 transition-all duration-150 ease-in-out ${ // Tambah hover border indigo
            snapshot.isDragging ? 'shadow-xl scale-[1.03] rotate-1' : ''
          }`}
          style={{ ...provided.draggableProps.style }}
        >
          <h4 className="font-medium text-gray-800 mb-1 break-words text-sm leading-snug">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-gray-600 mt-1 mb-2 break-words">
              {task.description}
            </p>
          )}
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
            <span className={`text-xs font-medium ${task.deadline ? 'text-gray-500' : 'text-transparent'}`}>
              {task.deadline ? `Due: ${formatDate(task.deadline)}` : 'No date'}
            </span>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
               <button
                 onClick={() => onEdit(task)}
                 className="text-gray-400 hover:text-indigo-600 p-1 rounded hover:bg-gray-100"
                 aria-label="Edit Task" title="Edit Task"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
               </button>
               <button
                 onClick={() => onDelete(task.id)}
                 className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-gray-100"
                 aria-label="Delete Task" title="Delete Task"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
               </button>
             </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;