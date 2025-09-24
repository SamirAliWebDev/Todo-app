
import React, { useState, useMemo } from 'react';

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
                const day = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
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
                                : 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50'
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


const TasksPage: React.FC = () => {
    return (
        <div className="flex flex-col h-full animate-fade-in">
            <header className="text-center mb-8">
                <h1 className="text-5xl font-extrabold tracking-widest text-glow">TODO</h1>
            </header>
            <DateCarousel />
            <div className="flex-grow flex items-center justify-center mt-8">
                 <p className="text-slate-500">No tasks for today. Add one!</p>
            </div>
        </div>
    );
}

export default TasksPage;
