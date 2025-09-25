import React, { useState } from 'react';
import type { Page, Priority, Task } from '../types';

interface AddOrEditTaskPageProps {
  onNavigate: (page: Page) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
}

const AddOrEditTaskPage: React.FC<AddOrEditTaskPageProps> = ({ onNavigate, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
        // Simple validation: do not add empty tasks
        return;
    }

    onAddTask({ title, description, priority });
    onNavigate('Tasks');
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900">Add New Task</h1>
        <button 
          onClick={() => onNavigate('Home')} 
          className="text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>
      
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col space-y-6">
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 mb-1">
            Task Title
          </label>
          <input
            type="text"
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Finish project report"
            className="w-full px-4 py-3 bg-white/60 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        
        <div>
          <label htmlFor="task-description" className="block text-sm font-medium text-slate-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="task-description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about your task..."
            className="w-full px-4 py-3 bg-white/60 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          ></textarea>
        </div>

        <div>
           <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700 mb-1">
            Priority
          </label>
           <select 
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-4 py-3 bg-white/60 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
           >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
           </select>
        </div>
        
        <div className="mt-auto pt-4">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/30"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrEditTaskPage;