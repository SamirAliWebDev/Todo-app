import React from 'react';
import { ListIcon, CheckIcon, ClockIcon } from '../components/Icons';
import type { Task } from '../types';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; count: number }> = ({ icon, label, count }) => (
  <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl flex-1 p-4 flex flex-col items-center justify-center space-y-2 border border-white/10 shadow-lg shadow-black/20 text-slate-300">
    {icon}
    <span className="text-4xl font-bold text-white">{count}</span>
    <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
  </div>
);

const isSameDay = (d1: Date, d2: Date) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
};

interface HomePageProps {
  tasks: Task[];
}

const HomePage: React.FC<HomePageProps> = ({ tasks }) => {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(currentDate);
  
  const todaysTasks = tasks.filter(task => isSameDay(task.date, currentDate));

  const totalTasks = todaysTasks.length;
  const completedTasks = todaysTasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const greeting = getGreeting();

  return (
    <div className="p-6 flex flex-col h-full text-center space-y-12">
      <header className="content-fade-in-active" style={{ animationDelay: '100ms' }}>
        <p className="text-xl font-semibold text-cyan-400">{greeting}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-1">Welcome to Zenith</h1>
        <p className="text-slate-400 mt-2">{formattedDate}</p>
      </header>

      <section className="flex justify-center items-center gap-4 content-fade-in-active" style={{ animationDelay: '200ms' }}>
        <StatCard icon={<ListIcon />} label="Total" count={totalTasks} />
        <StatCard icon={<CheckIcon />} label="Completed" count={completedTasks} />
        <StatCard icon={<ClockIcon />} label="Pending" count={pendingTasks} />
      </section>

      <footer className="mt-auto pt-12 content-fade-in-active" style={{ animationDelay: '300ms' }}>
        <blockquote className="text-slate-400 italic">
          <p>"The secret of getting ahead is getting started."</p>
          <cite className="text-slate-300 not-italic block mt-2">- Mark Twain</cite>
        </blockquote>
      </footer>
    </div>
  );
};

export default HomePage;