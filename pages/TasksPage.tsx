import React, { useMemo } from 'react';
import type { Task } from '../types';
import TaskItem from '../components/TaskItem';

const isSameDay = (d1: Date, d2: Date) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

interface DateCarouselProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const DateCarousel: React.FC<DateCarouselProps> = ({ selectedDate, onDateSelect }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            return date;
        });
    }, []);

    return (
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
            {dates.map((date, index) => {
                const day = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
                const dayOfMonth = date.getDate();
                const isSelected = isSameDay(selectedDate, date);

                return (
                    <button
                        key={date.toISOString()}
                        onClick={() => onDateSelect(date)}
                        className={`
                            flex-shrink-0 w-16 h-20 rounded-xl p-2 flex flex-col items-center justify-center transition-all duration-300
                            date-item-animate
                            ${isSelected
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40'
                                : 'bg-white/60 hover:bg-slate-200/80 text-slate-600 border border-slate-200/50'
                            }
                        `}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <span className="text-xs font-semibold">{day}</span>
                        <span className="text-2xl font-bold mt-1">{dayOfMonth}</span>
                    </button>
                );
            })}
        </div>
    );
};

interface TasksPageProps {
    tasks: Task[];
    onToggleTask: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ tasks, onToggleTask, onDeleteTask, selectedDate, onDateSelect }) => {

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => isSameDay(task.date, selectedDate));
    }, [tasks, selectedDate]);
    
    const isTodaySelected = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return isSameDay(today, selectedDate);
    }, [selectedDate]);

    return (
        <div className="flex flex-col h-full">
            <header className="text-center mb-8">
                <h1 className="text-5xl font-extrabold tracking-widest">TODO</h1>
            </header>
            <DateCarousel selectedDate={selectedDate} onDateSelect={onDateSelect} />
            <div className="flex-grow mt-8">
                {filteredTasks.length === 0 ? (
                     <div className="flex items-center justify-center h-full">
                        <p className="text-slate-400">
                            {isTodaySelected ? "No tasks for today. Add one!" : "No tasks for this day."}
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-300 -translate-x-1/2 timeline-line-animate"></div>
                        <ul className="space-y-6">
                            {filteredTasks.map((task, index) => (
                                <TaskItem 
                                    key={task.id} 
                                    task={task} 
                                    onToggle={onToggleTask} 
                                    onDelete={onDeleteTask}
                                    index={index}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TasksPage;