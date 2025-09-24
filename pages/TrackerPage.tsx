
import React from 'react';
import { GraphIcon } from '../components/Icons';

const TrackerPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in pt-8">
      <h1 className="text-5xl font-extrabold text-white text-glow">Tracker</h1>
      <p className="text-slate-400 mt-2">Track your progress and productivity.</p>

      <div className="w-full max-w-md mt-12 bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50">
        <h2 className="text-2xl font-bold text-white">Productivity Insights</h2>
        <p className="text-slate-400 mt-3 mb-8">
          Visualize your task completion trends, identify your most productive days, and track your progress over time.
        </p>
        
        <button
          disabled
          className="w-full flex items-center justify-center bg-gradient-to-br from-blue-600/70 to-blue-800/70 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed opacity-50 transition-transform transform hover:scale-105"
        >
          <GraphIcon />
          Generate Graph
        </button>
        <p className="text-sm text-slate-500 mt-4">This feature is coming soon!</p>
      </div>
    </div>
  );
};

export default TrackerPage;
