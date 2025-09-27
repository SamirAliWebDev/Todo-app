import React, { useMemo, useRef, useEffect } from 'react';
import type { Task, Priority } from '../types';
import TaskItem from '../components/TaskItem';
import Header from '../components/Header';

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
    const carouselRef = useRef<HTMLDivElement>(null);

    const dates = useMemo(() => {
        const dateArray: Date[] = [];
        // Generate a range of dates: 30 days past, today, 30 days future
        for (let i = -30; i <= 30; i++) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() + i);
            dateArray.push(date);
        }
        return dateArray;
    }, []);

    useEffect(() => {
        if (carouselRef.current) {
            const todayElement = carouselRef.current.querySelector('[data-is-today="true"]');
            if (todayElement) {
                // Instantly scroll to center today's date on initial load.
                todayElement.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
            }
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div ref={carouselRef} className="flex space-x-3 overflow-x-auto scrollbar-hide md:justify-center px-4 py-2">
            {dates.map((date, index) => {
                const day = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
                const dayOfMonth = date.getDate();
                const isSelected = isSameDay(selectedDate, date);
                const isToday = isSameDay(today, date);

                return (
                    <button
                        key={date.toISOString()}
                        onClick={() => onDateSelect(date)}
                        data-is-today={isToday}
                        className={`
                            flex-shrink-0 w-14 h-20 rounded-xl p-2 flex flex-col items-center justify-center transition-all duration-300
                            date-item-animate
                            ${isSelected
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40'
                                : 'bg-slate-200/80 dark:bg-slate-800/60 hover:bg-slate-300/80 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/10 shadow-md shadow-black/20'
                            }
                            ${isToday && !isSelected ? 'ring-2 ring-offset-2 ring-offset-white/90 dark:ring-offset-slate-800/90 ring-amber-500' : ''}
                        `}
                        style={{ animationDelay: `${(index - 30) * 20}ms` }}
                    >
                        <span className="text-sm font-semibold">{day}</span>
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
    onEditTask: (taskId: string) => void;
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ tasks, onToggleTask, onDeleteTask, onEditTask, selectedDate, onDateSelect }) => {

    const filteredTasks = useMemo(() => {
        const priorityOrder: Record<Priority, number> = {
            'High': 1,
            'Medium': 2,
            'Low': 3,
        };

        const tasksToProcess = tasks.filter(task => isSameDay(task.date, selectedDate));

        return tasksToProcess.sort((a, b) => {
            // 1. Sort by completion status (incomplete tasks first)
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            // 2. Sort by priority (High > Medium > Low)
            const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityComparison !== 0) {
                return priorityComparison;
            }
            // 3. Sort by creation time (older tasks first)
            return Number(a.id) - Number(b.id);
        });
    }, [tasks, selectedDate]);
    
    const isTodaySelected = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return isSameDay(today, selectedDate);
    }, [selectedDate]);

    const headerInfo = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // Ensure selectedDate is also normalized to the start of the day for accurate comparison
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);

        let dayName = '';
        if (selected.getTime() === today.getTime()) {
            dayName = "Today";
        } else if (selected.getTime() === tomorrow.getTime()) {
            dayName = "Tomorrow";
        } else if (selected.getTime() === yesterday.getTime()) {
            dayName = "Yesterday";
        } else {
            dayName = selected.toLocaleString('en-US', { weekday: 'long' });
        }
        
        const fullDate = selected.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: selected.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        });

        return { dayName, fullDate };
    }, [selectedDate]);

    return (
        <div className="flex flex-col h-full">
            <Header title={headerInfo.dayName} subtitle={headerInfo.fullDate}>
                <DateCarousel selectedDate={selectedDate} onDateSelect={onDateSelect} />
            </Header>
            <div className="flex-grow px-6 pt-8 pb-32">
                {filteredTasks.length === 0 ? (
                     <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 dark:text-slate-400">
                           {isTodaySelected 
                                ? "No tasks for today. Add one!" 
                                : "No tasks for this day."}
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-600 -translate-x-1/2 timeline-line-animate"></div>
                        <ul className="space-y-6">
                            {filteredTasks.map((task, index) => (
                                <TaskItem 
                                    key={task.id} 
                                    task={task} 
                                    onToggle={onToggleTask} 
                                    onDelete={onDeleteTask}
                                    onEdit={onEditTask}
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