import React, { useState } from 'react';
import type { Page, Priority, Task, TaskCategory, PredefinedCategory } from '../types';
import { HeaderCloseIcon, ChevronRightIcon } from '../components/Icons';
import { categoryList, CategoryDisplay } from '../lib/categories';

const formatDateForInput = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
};

interface CategoryPickerModalProps {
  onClose: () => void;
  onSelectCategory: (category: TaskCategory) => void;
  currentCategory: TaskCategory;
}

const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({ onClose, onSelectCategory, currentCategory }) => {
    const [emojiInput, setEmojiInput] = useState(
        currentCategory.type === 'emoji' ? currentCategory.value : ''
    );

    const handleEmojiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmojiInput(value);

        if (value) {
            onSelectCategory({ type: 'emoji', value });
        } else if (currentCategory.type === 'emoji') {
            onSelectCategory({ type: 'icon', value: 'Other' });
        }
    };

    const handleIconSelect = (categoryValue: PredefinedCategory) => {
        onSelectCategory({ type: 'icon', value: categoryValue });
        setEmojiInput('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm modal-enter" onClick={onClose}>
            <div className="modal-content w-full max-w-sm bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Choose a Category</h3>
                
                <div className="grid grid-cols-7 gap-3 p-2 bg-slate-200 dark:bg-slate-900/50 rounded-lg">
                    {categoryList.map(cat => (
                        <button
                            type="button"
                            key={cat.id}
                            onClick={() => handleIconSelect(cat.id)}
                            title={cat.label}
                            aria-label={`Select category: ${cat.label}`}
                            className={`flex justify-center items-center p-1 rounded-full transition-all duration-200 focus:outline-none ${currentCategory.type === 'icon' && currentCategory.value === cat.id ? 'ring-2 ring-offset-2 ring-cyan-500 ring-offset-slate-100 dark:ring-offset-slate-800' : ''}`}
                        >
                            <CategoryDisplay category={{type: 'icon', value: cat.id}} className="w-9 h-9" />
                        </button>
                    ))}
                </div>

                <div className="mt-4">
                    <label htmlFor="emoji-input" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                        Or use a custom emoji or text
                    </label>
                    <input
                        type="text"
                        id="emoji-input"
                        value={emojiInput}
                        onChange={handleEmojiChange}
                        placeholder="e.g., 🎉 or Urgent"
                        className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-center text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition placeholder:text-slate-400"
                    />
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

interface AddOrEditTaskPageProps {
  onNavigate: (page: Page) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  selectedDate: Date;
}

const AddOrEditTaskPage: React.FC<AddOrEditTaskPageProps> = ({ onNavigate, onAddTask, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [taskDate, setTaskDate] = useState(formatDateForInput(selectedDate));
  const [category, setCategory] = useState<TaskCategory>({ type: 'icon', value: 'Personal' });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
        return;
    }
    
    const selectedTaskDate = new Date(`${taskDate}T00:00:00`);

    onAddTask({ title, description, priority, date: selectedTaskDate, category });
    onNavigate('Tasks');
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <header className="p-6 flex items-center justify-between flex-shrink-0">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Add New Task</h1>
          <button 
              onClick={() => onNavigate('Home')} 
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 -mr-2"
              aria-label="Close"
          >
              <HeaderCloseIcon />
          </button>
        </header>
        
        <div className="p-6 pt-0 flex-grow flex flex-col">
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col space-y-6">
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Task Title
              </label>
              <input
                type="text"
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Finish project report"
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition placeholder:text-slate-500 dark:placeholder:text-slate-400"
                required
              />
            </div>
            
            <div>
              <label htmlFor="task-description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="task-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about your task..."
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition placeholder:text-slate-500 dark:placeholder:text-slate-400"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Category
              </label>
              <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="w-full flex items-center justify-between text-left px-4 py-3 bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition"
              >
                  <div className="flex items-center">
                      <CategoryDisplay category={category} className="w-6 h-6 mr-3" />
                      <span className="font-medium">
                          {category.type === 'icon' 
                              ? categoryList.find(c => c.id === category.value)?.label ?? 'Category'
                              : 'Custom'
                          }
                      </span>
                  </div>
                  <ChevronRightIcon />
              </button>
            </div>


            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="task-priority" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Priority
                    </label>
                    <select 
                        id="task-priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition appearance-none"
                    >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="task-date" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Date
                    </label>
                    <input
                        type="date"
                        id="task-date"
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition"
                        required
                    />
                </div>
            </div>
            
            <div className="mt-auto pt-4">
              <button 
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-4 rounded-lg transition-colors shadow-lg shadow-cyan-500/30"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
      {isCategoryModalOpen && (
          <CategoryPickerModal
              currentCategory={category}
              onSelectCategory={setCategory}
              onClose={() => setIsCategoryModalOpen(false)}
          />
      )}
    </>
  );
};

export default AddOrEditTaskPage;