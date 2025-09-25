import React from 'react';
import { ListIcon, CheckIcon, ClockIcon } from '../components/Icons';
import type { Task } from '../types';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; count: number }> = ({ icon, label, count }) => (
  <div className="bg-white/50 backdrop-blur-sm rounded-2xl flex-1 p-4 flex flex-col items-center justify-center space-y-2 border border-slate-200/80">
    {icon}
    <span className="text-4xl font-bold text-slate-900">{count}</span>
    <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">{label}</span>
  </div>
);

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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="flex flex-col h-full text-center space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Welcome to Zenith</h1>
        <p className="text-slate-500 mt-2">{formattedDate}</p>
      </header>

      <section className="flex justify-center items-center gap-4">
        <StatCard icon={<ListIcon />} label="Total" count={totalTasks} />
        <StatCard icon={<CheckIcon />} label="Completed" count={completedTasks} />
        <StatCard icon={<ClockIcon />} label="Pending" count={pendingTasks} />
      </section>

      <footer className="mt-auto pt-12">
        <blockquote className="text-slate-500 italic">
          <p>"The secret of getting ahead is getting started."</p>
          <cite className="text-slate-600 not-italic block mt-2">- Mark Twain</cite>
        </blockquote>
      </footer>
    </div>
  );
};

export default HomePage;