import React, { useState, useMemo } from 'react'; 
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

function KanbanColumn({ title, status, tasks, onEdit, onDelete }) {
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortDir(criteria === 'deadline' ? 'asc' : 'desc'); 
    }
  };

  const sortedTasks = useMemo(() => {
    const sortableTasks = [...tasks];
    sortableTasks.sort((a, b) => {
      let valA, valB;

      if (sortBy === 'deadline') {
        valA = a.deadline ? new Date(a.deadline) : (sortDir === 'asc' ? Infinity : -Infinity);
        valB = b.deadline ? new Date(b.deadline) : (sortDir === 'asc' ? Infinity : -Infinity);
      } else { 
        valA = new Date(a.created_at);
        valB = new Date(b.created_at);
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableTasks;
  }, [tasks, sortBy, sortDir]);

  return (
    <div className="flex-1 min-w-[280px] max-w-sm bg-gray-100 dark:bg-slate-800 rounded-lg p-3 mx-0 md:mx-1 flex flex-col">
      <div className="flex justify-between items-center mb-4 px-1 pt-1">
        <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </h3>
        <button
          onClick={() => handleSort('deadline')}
          title={`Sort by Deadline ${sortBy === 'deadline' ? (sortDir === 'asc' ? '(Ascending)' : '(Descending)') : ''}`}
          className={`p-1 rounded ${sortBy === 'deadline' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-slate-700' : 'text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
        >
          {sortBy === 'deadline' ? (sortDir === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />) : <FiArrowDown size={14} />} {/* Default icon */}
          <span className="sr-only">Sort by Deadline</span>
        </button>
        <span className="text-xs font-medium text-gray-500 dark:text-slate-400 bg-gray-200 dark:bg-slate-700 rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow min-h-[250px] p-1 rounded-md transition-colors duration-200 ease-in-out ${
              snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-transparent'
            }`}
          >
            {sortedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;