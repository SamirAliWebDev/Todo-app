
import React from 'react';
import { ListIcon, CheckIcon, ClockIcon } from '../components/Icons';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; count: number }> = ({ icon, label, count }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl flex-1 p-4 flex flex-col items-center justify-center space-y-2 border border-slate-700/50">
    {icon}
    <span className="text-4xl font-bold text-white">{count}</span>
    <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{label}</span>
  </div>
);

const HomePage: React.FC = () => {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(currentDate);

  return (
    <div className="flex flex-col h-full text-center space-y-12 animate-fade-in">
      <header>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-glow">Welcome to Zenith</h1>
        <p className="text-slate-400 mt-2">{formattedDate}</p>
      </header>

      <section className="flex justify-center items-center gap-4">
        <StatCard icon={<ListIcon />} label="Total" count={0} />
        <StatCard icon={<CheckIcon />} label="Completed" count={0} />
        <StatCard icon={<ClockIcon />} label="Pending" count={0} />
      </section>

      <footer className="mt-auto pt-12">
        <blockquote className="text-slate-400 italic">
          <p>"The secret of getting ahead is getting started."</p>
          <cite className="text-slate-500 not-italic block mt-2">- Mark Twain</cite>
        </blockquote>
      </footer>
    </div>
  );
};

export default HomePage;
