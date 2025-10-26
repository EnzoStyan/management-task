// frontend/src/components/KanbanColumn.js
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

function KanbanColumn({ title, status, tasks, onEdit, onDelete }) {
  return (
    // Background abu-abu muda, hilangkan dark mode variant
    <div className="flex-1 min-w-[280px] max-w-sm bg-gray-100 rounded-lg p-3 mx-0 md:mx-1 flex flex-col">
      <div className="flex justify-between items-center mb-4 px-1 pt-1">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            // Highlight saat drag over (light mode)
            className={`flex-grow min-h-[250px] p-1 rounded-md transition-colors duration-200 ease-in-out ${
              snapshot.isDraggingOver ? 'bg-indigo-100' : 'bg-transparent'
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;