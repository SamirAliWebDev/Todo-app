import React, { useState } from 'react';
import type { Task } from '../types';
import { TrashIcon, SmallCheckIcon } from './Icons';

const priorityStyles: { [key in Task['priority']]: string } = {
  Low: 'bg-green-400',
  Medium: 'bg-yellow-400',
  High: 'bg-red-500',
};

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, index }) => {
  const [isExiting, setIsExiting] = useState(false);
  const animationDelay = `${index * 100}ms`;

  const handleDelete = () => {
    setIsExiting(true);
    // Wait for animation to finish before calling the parent's onDelete
    setTimeout(() => {
      onDelete(task.id);
    }, 300); // This duration must match the CSS animation duration
  };

  return (
    <li
      className={`relative pl-12 group ${isExiting ? 'task-item-exit-active' : 'task-item-animate'}`}
      style={!isExiting ? { animationDelay } : {}}
    >
      {/* Timeline Circle / Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
        className={`
          absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full 
          ring-4 ring-slate-100 flex items-center justify-center transition-colors duration-200
          ${task.completed ? 'bg-blue-600' : priorityStyles[task.priority]}
        `}
      >
        {task.completed && <SmallCheckIcon />}
      </button>

      {/* Task Content */}
      <div
        className={`
            w-full py-2
            flex items-center justify-between transition-opacity duration-300
            ${task.completed ? 'opacity-60' : ''}
        `}
      >
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onToggle(task.id)}
        >
          <p id={`task-title-${task.id}`} className={`font-semibold text-slate-800 truncate ${task.completed ? 'line-through text-slate-500' : ''}`}>
            {task.title}
          </p>
          {task.description && <p className="text-sm text-slate-500 truncate">{task.description}</p>}
        </div>
        <button
          onClick={handleDelete}
          aria-label={`Delete task: ${task.title}`}
          className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 flex-shrink-0"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
