import React, { useState, useMemo } from 'react';
import type { Task } from '../types';
import TaskItem from '../components/TaskItem';

const DateCarousel: React.FC = () => {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today.getDate());

    const dates = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() + i);
            return date;
        });
    }, [today]);

    return (
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
            {dates.map((date) => {
                const day = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
                const dayOfMonth = date.getDate();
                const isSelected = selectedDate === dayOfMonth;

                return (
                    <button
                        key={dayOfMonth}
                        onClick={() => setSelectedDate(dayOfMonth)}
                        className={`
                            flex-shrink-0 w-16 h-20 rounded-xl p-2 flex flex-col items-center justify-center transition-all duration-300
                            ${isSelected
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40'
                                : 'bg-white/60 hover:bg-slate-200/80 text-slate-600 border border-slate-200/50'
                            }
                        `}
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
}

const TasksPage: React.FC<TasksPageProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
    return (
        <div className="flex flex-col h-full">
            <header className="text-center mb-8">
                <h1 className="text-5xl font-extrabold tracking-widest">TODO</h1>
            </header>
            <DateCarousel />
            <div className="flex-grow mt-8">
                {tasks.length === 0 ? (
                     <div className="flex items-center justify-center h-full">
                        <p className="text-slate-400">No tasks for today. Add one!</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-300 -translate-x-1/2 timeline-line-animate"></div>
                        <ul className="space-y-6">
                            {tasks.map((task, index) => (
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