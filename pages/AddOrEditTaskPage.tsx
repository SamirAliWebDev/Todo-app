import React, { useState, useEffect, useRef } from 'react';
import type { Page, Priority, Task, TaskCategory, PredefinedCategory } from '../types';
import { HeaderCloseIcon, ChevronRightIcon, FlagIcon, SunIcon, MoonIcon, SunsetIcon, XCircleIcon } from '../components/Icons';
import { categoryList, CategoryDisplay } from '../lib/categories';

// Helper to convert 24h string to 12h object
const parseTime = (time24: string): { hour: string; minute: string; period: 'AM' | 'PM' } => {
    if (!time24 || !time24.includes(':')) {
        return { hour: '09', minute: '00', period: 'AM' }; // Default
    }
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    let hour12 = h % 12;
    if (hour12 === 0) { // 12 AM (midnight) or 12 PM (noon)
        hour12 = 12;
    }
    return {
        hour: String(hour12).padStart(2, '0'),
        minute: String(m).padStart(2, '0'),
        period: period as 'AM' | 'PM'
    };
};

// Helper to convert 12h object to 24h string
const formatTime = (hour: string, minute: string, period: 'AM' | 'PM'): string => {
    let h = parseInt(hour, 10);
    if (period === 'PM' && h < 12) {
        h += 12;
    } else if (period === 'AM' && h === 12) { // Midnight case: 12 AM is 00 hours
        h = 0;
    }
    return `${String(h).padStart(2, '0')}:${minute}`;
};

const AnalogClockPicker: React.FC<{
    hour: number;
    minute: number;
    mode: 'hour' | 'minute';
    onHourChange: (hour: number) => void;
    onMinuteChange: (minute: number) => void;
    setMode: (mode: 'hour' | 'minute') => void;
}> = ({ hour, minute, mode, onHourChange, onMinuteChange, setMode }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const isDragging = useRef(false);

    const hourAngle = (hour % 12) * 30 + minute * 0.5;
    const minuteAngle = minute * 6;

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const svgX = clientX - rect.left;
        const svgY = clientY - rect.top;

        const x = (svgX / rect.width) * 200;
        const y = (svgY / rect.height) * 200;

        const angleRad = Math.atan2(y - 100, x - 100);
        let angleDeg = (angleRad * 180 / Math.PI + 90 + 360) % 360;

        if (mode === 'hour') {
            let selectedHour = Math.round(angleDeg / 30);
            if (selectedHour === 0) selectedHour = 12;
            onHourChange(selectedHour);
            setTimeout(() => setMode('minute'), 100); // Short delay before switching
        } else {
            let selectedMinute = Math.round(angleDeg / 6) % 60;
            onMinuteChange(selectedMinute);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        handleInteraction(e);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging.current) {
            handleInteraction(e);
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        isDragging.current = true;
        handleInteraction(e);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging.current) {
            handleInteraction(e);
        }
    };
    
    return (
        <div className="relative w-full aspect-square max-w-[250px] mx-auto select-none">
            <svg
                ref={svgRef}
                viewBox="0 0 200 200"
                className="w-full h-full cursor-pointer"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => isDragging.current = false}
            >
                {/* Clock Face */}
                <circle cx="100" cy="100" r="98" className="fill-slate-100 dark:fill-slate-800/60" />
                <circle cx="100" cy="100" r="98" className="stroke-slate-300 dark:stroke-slate-600/50" strokeWidth="1" fill="none" />
                
                {/* Numbers & Markers */}
                {Array.from({ length: 12 }, (_, i) => {
                    const h = i + 1;
                    const angle = (h * 30 - 90) * (Math.PI / 180);
                    const x = 100 + 85 * Math.cos(angle);
                    const y = 100 + 85 * Math.sin(angle) + 5;
                    const isSelected = mode === 'hour' && (hour === h || (hour === 0 || hour > 12) && (hour % 12) === h);
                    return (
                        <text
                            key={`hour-${h}`}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            className={`text-lg font-medium transition-colors ${isSelected ? 'fill-cyan-500 font-bold' : 'fill-slate-500 dark:fill-slate-400'}`}
                        >
                            {h}
                        </text>
                    )
                })}
                {Array.from({ length: 60 }, (_, i) => {
                    const isFiveMinuteMark = i % 5 === 0;
                    const isSelected = mode === 'minute' && minute === i;
                    const angle = (i * 6 - 90) * (Math.PI / 180);
                    const r = isSelected ? 4 : (isFiveMinuteMark ? 2 : 1);
                    const x = 100 + 92 * Math.cos(angle);
                    const y = 100 + 92 * Math.sin(angle);
                    return <circle key={`min-${i}`} cx={x} cy={y} r={r} className={`transition-all ${isSelected ? 'fill-cyan-500' : 'fill-slate-300 dark:fill-slate-600'}`} />
                })}

                {/* Hands */}
                <line x1="100" y1="100" x2="100" y2="55"
                    strokeWidth={mode === 'hour' ? 4 : 2}
                    className={`stroke-linecap-round transition-all duration-300 ${mode === 'hour' ? 'stroke-cyan-500' : 'stroke-slate-500 dark:stroke-slate-400'}`}
                    style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: 'center' }}
                />
                <line x1="100" y1="100" x2="100" y2="30"
                    strokeWidth={mode === 'minute' ? 4 : 2}
                    className={`stroke-linecap-round transition-all duration-300 ${mode === 'minute' ? 'stroke-cyan-500' : 'stroke-slate-400 dark:stroke-slate-500'}`}
                    style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: 'center' }}
                />

                {/* Center dot */}
                <circle cx="100" cy="100" r="4" className="fill-cyan-500" />
            </svg>
        </div>
    );
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

const PriorityButton: React.FC<{
    level: Priority;
    current: Priority;
    onClick: (level: Priority) => void;
}> = ({ level, current, onClick }) => {
    const isSelected = level === current;

    const styles: { [key in Priority]: { base: string; selected: string; unselected: string } } = {
        Low: {
            base: 'text-green-600 dark:text-green-400',
            selected: 'bg-green-500/20 border-green-500',
            unselected: 'border-slate-300 dark:border-slate-600 hover:bg-green-500/10 hover:border-green-500/50',
        },
        Medium: {
            base: 'text-yellow-600 dark:text-yellow-400',
            selected: 'bg-yellow-500/20 border-yellow-500',
            unselected: 'border-slate-300 dark:border-slate-600 hover:bg-yellow-500/10 hover:border-yellow-500/50',
        },
        High: {
            base: 'text-red-600 dark:text-red-400',
            selected: 'bg-red-500/20 border-red-500',
            unselected: 'border-slate-300 dark:border-slate-600 hover:bg-red-500/10 hover:border-red-500/50',
        },
    };

    return (
        <button
            type="button"
            onClick={() => onClick(level)}
            className={`w-full p-3 rounded-lg border-2 flex items-center justify-center font-semibold transition-all duration-200 ${styles[level].base} ${isSelected ? styles[level].selected : styles[level].unselected}`}
        >
            <FlagIcon className="h-5 w-5 mr-2" />
            {level}
        </button>
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
  const [reminderTime, setReminderTime] = useState('');
  const [category, setCategory] = useState<TaskCategory>({ type: 'icon', value: 'Personal' });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // State for the time picker
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [clockMode, setClockMode] = useState<'hour' | 'minute'>('hour');

  // Sync from parent's reminderTime string to the picker's state
  useEffect(() => {
    if (reminderTime) {
      const { hour, minute, period } = parseTime(reminderTime);
      setHour(hour);
      setMinute(minute);
      setPeriod(period);
    }
  }, [reminderTime]);

  // Sync from the picker's state back to the parent's reminderTime string
  useEffect(() => {
    if (reminderTime) {
      const newTime = formatTime(hour, minute, period);
      // This check prevents an infinite loop
      if (newTime !== reminderTime) {
        setReminderTime(newTime);
      }
    }
  }, [hour, minute, period, reminderTime]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
        return;
    }
    
    const selectedTaskDate = selectedDate;

    onAddTask({ title, description, priority, date: selectedTaskDate, category, reminderTime: reminderTime || undefined });
    onNavigate('Tasks');
  };

  const timeSuggestions = [
    { label: 'Morning', time: '09:00', icon: <SunIcon /> },
    { label: 'Afternoon', time: '13:00', icon: <SunsetIcon /> },
    { label: 'Evening', time: '18:00', icon: <MoonIcon /> },
  ];

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
        
        <div className="p-6 pt-0 flex-grow flex flex-col overflow-y-auto scrollbar-hide">
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

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Low', 'Medium', 'High'] as Priority[]).map(level => (
                    <PriorityButton key={level} level={level} current={priority} onClick={setPriority} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Reminder Time (Optional)
                  </label>
                  {reminderTime && (
                      <button
                          type="button"
                          onClick={() => setReminderTime('')}
                          className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 flex items-center transition-colors"
                          aria-label="Clear reminder time"
                      >
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Clear
                      </button>
                  )}
              </div>
              <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                      {timeSuggestions.map(({ label, time, icon }) => {
                          const isActive = reminderTime === time;
                          return (
                              <button
                                  type="button"
                                  key={time}
                                  onClick={() => setReminderTime(time)}
                                  className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center text-sm font-semibold transition-all duration-200 h-20 ${
                                      isActive
                                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500'
                                  }`}
                              >
                                  {React.cloneElement(icon, { className: 'h-6 w-6 mb-1' })}
                                  {label}
                              </button>
                          );
                      })}
                  </div>
                  <div className="bg-slate-200/50 dark:bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-center text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                            <span
                                onClick={() => setClockMode('hour')}
                                className={`cursor-pointer p-2 rounded-lg transition-colors ${clockMode === 'hour' ? 'text-cyan-500 bg-cyan-500/10' : ''}`}
                            >
                                {hour}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500">:</span>
                            <span
                                onClick={() => setClockMode('minute')}
                                className={`cursor-pointer p-2 rounded-lg transition-colors ${clockMode === 'minute' ? 'text-cyan-500 bg-cyan-500/10' : ''}`}
                            >
                                {minute}
                            </span>
                        </div>

                        <AnalogClockPicker
                            hour={parseInt(hour)}
                            minute={parseInt(minute)}
                            mode={clockMode}
                            onHourChange={h => setHour(String(h).padStart(2, '0'))}
                            onMinuteChange={m => setMinute(String(m).padStart(2, '0'))}
                            setMode={setClockMode}
                        />

                        <div className="flex justify-center space-x-2 mt-4">
                            <button 
                                type="button"
                                onClick={() => setPeriod('AM')}
                                aria-pressed={period === 'AM'}
                                className={`px-4 py-2 text-lg font-bold rounded-md transition-colors w-20 ${period === 'AM' ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-300/70 dark:bg-slate-800/80 text-slate-500'}`}
                            >
                                AM
                            </button>
                            <button
                                type="button" 
                                onClick={() => setPeriod('PM')}
                                aria-pressed={period === 'PM'}
                                className={`px-4 py-2 text-lg font-bold rounded-md transition-colors w-20 ${period === 'PM' ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-300/70 dark:bg-slate-800/80 text-slate-500'}`}
                            >
                                PM
                            </button>
                        </div>
                    </div>
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