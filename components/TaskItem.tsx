import React, { useState, useRef } from 'react';
import type { Task } from '../types';
import { TrashIcon, SmallCheckIcon, ClockIcon, FlagIcon, PencilIcon } from './Icons';
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
  onEdit: (id: string) => void;
  index: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit, index }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const initialTranslateX = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const ACTION_WIDTH = 128; // w-14 (56px) * 2 + gap-3 (12px) + padding
  const animationDelay = `${index * 100}ms`;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !contentRef.current || !actionsRef.current) return; // Only main button
    dragStartX.current = e.clientX;
    isDragging.current = true;
    initialTranslateX.current = translateX;
    contentRef.current.setPointerCapture(e.pointerId);
    contentRef.current.style.transition = 'none'; // Disable transition during drag
    actionsRef.current.style.transition = 'none';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - dragStartX.current;
    const newTranslateX = Math.max(-ACTION_WIDTH, Math.min(0, initialTranslateX.current + deltaX));
    setTranslateX(newTranslateX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !contentRef.current || !actionsRef.current) return;
    isDragging.current = false;
    contentRef.current.releasePointerCapture(e.pointerId);
    const snapTransition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    contentRef.current.style.transition = snapTransition;
    actionsRef.current.style.transition = snapTransition;

    const dragDistance = e.clientX - dragStartX.current;
    // Treat as a click if not moved much and actions are hidden
    if (Math.abs(dragDistance) < 10 && initialTranslateX.current === 0) {
      onToggle(task.id);
      setTranslateX(0); // Ensure it snaps back if there was a tiny drag
      return;
    }

    // Snap logic
    if (translateX < -ACTION_WIDTH / 2) {
      setTranslateX(-ACTION_WIDTH);
    } else {
      setTranslateX(0);
    }
  };


  const handleDelete = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 300); 
  };
  
  const handleEdit = () => {
    onEdit(task.id);
    setTranslateX(0); // Close actions after tapping edit
  };

  // Animation progress for the reveal effect
  const revealProgress = Math.min(1, Math.abs(translateX) / ACTION_WIDTH);

  return (
    <li
      className={`relative pl-12 overflow-hidden ${isExiting ? 'task-item-exit-active' : 'task-item-animate'}`}
      style={!isExiting ? { animationDelay } : {}}
    >
      {/* Timeline Circle / Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
        className={`
          absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full 
          ring-4 ring-slate-100 dark:ring-slate-800 flex items-center justify-center transition-colors duration-200 z-20
          ${task.completed ? 'bg-cyan-500' : priorityStyles[task.priority]}
        `}
      >
        {task.completed && <SmallCheckIcon />}
      </button>

      {/* Actions container (hidden underneath) */}
      <div
        ref={actionsRef}
        style={{
            transform: `translateX(${ACTION_WIDTH * (1 - revealProgress)}px)`,
        }}
        className="absolute inset-y-0 right-0 flex items-center justify-end px-2 gap-2 z-0"
        aria-hidden={revealProgress < 0.5}
      >
        <button
          onClick={handleEdit}
          style={{ pointerEvents: revealProgress > 0.9 ? 'auto' : 'none' }}
          className="w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-all duration-100 shadow-md"
          aria-label={`Edit task: ${task.title}`}
          tabIndex={revealProgress > 0.9 ? 0 : -1}
        >
          <PencilIcon />
        </button>
        <button
          onClick={handleDelete}
          style={{ pointerEvents: revealProgress > 0.9 ? 'auto' : 'none' }}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-100 shadow-md"
          aria-label={`Delete task: ${task.title}`}
          tabIndex={revealProgress > 0.9 ? 0 : -1}
        >
          <TrashIcon />
        </button>
      </div>

      {/* Draggable Task Content Card */}
      <div
        ref={contentRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ transform: `translateX(${translateX}px)`, touchAction: 'pan-y' }}
        className={`
            relative w-full p-4
            flex items-center justify-between
            bg-white/80 dark:bg-slate-800/70 rounded-xl border border-slate-200/50 dark:border-white/10
            ${task.completed ? 'opacity-50' : ''}
            z-10 cursor-grab active:cursor-grabbing
        `}
      >
        <div className="flex-1 min-w-0">
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
      </div>
    </li>
  );
};

export default TaskItem;