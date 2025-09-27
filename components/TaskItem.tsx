import React, { useState } from 'react';
import type { Task } from '../types';
import { TrashIcon, SmallCheckIcon, ClockIcon, FlagIcon } from './Icons';
import { CategoryDisplay } from '../lib/categories';

const priorityStyles: { [key in Task['priority']]: string } = {
  Low: 'bg-green-400',
  Medium: 'bg-yellow-400',
  High: 'bg-red-500',
};

const priorityTextStyles: { [key in Task['priority']]: string } = {
  Low: 'text-green-600 dark:text-green-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  High: 'text-red-600 dark:text-red-500',
};

const formatTime12h = (time24: string): string => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Converts 0 to 12
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
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
          ring-4 ring-slate-100 dark:ring-slate-800 flex items-center justify-center transition-colors duration-200 z-10
          ${task.completed ? 'bg-cyan-500' : priorityStyles[task.priority]}
        `}
      >
        {task.completed && <SmallCheckIcon />}
      </button>

      {/* Task Content Card */}
      <div
        className={`
            w-full p-4 pr-12
            flex items-center justify-between transition-all duration-300
            bg-white/50 dark:bg-slate-800/40 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/10
            group-hover:shadow-lg group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/50 group-hover:border-slate-300 dark:group-hover:border-white/20
            ${task.completed ? 'opacity-50' : ''}
        `}
      >
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onToggle(task.id)}
        >
          <div className="flex items-center space-x-3">
            <CategoryDisplay category={task.category} className="w-6 h-6 flex-shrink-0" />
            <p id={`task-title-${task.id}`} className={`font-semibold text-slate-900 dark:text-white truncate ${task.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
              {task.title}
            </p>
          </div>
          {task.description && <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1 pl-9">{task.description}</p>}
          
          <div className="flex items-center space-x-4 mt-2 pl-9 text-xs">
            {task.reminderTime && (
              <div className="flex items-center text-slate-500 dark:text-slate-400">
                <ClockIcon className="h-4 w-4 mr-1.5" />
                <span>{formatTime12h(task.reminderTime)}</span>
              </div>
            )}
            <div className={`flex items-center font-medium ${priorityTextStyles[task.priority]}`}>
              <FlagIcon className="h-4 w-4 mr-1.5" />
              <span>{task.priority}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          aria-label={`Delete task: ${task.title}`}
          className="absolute right-4 top-1/2 -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 dark:text-slate-400 hover:text-red-500 flex-shrink-0"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;