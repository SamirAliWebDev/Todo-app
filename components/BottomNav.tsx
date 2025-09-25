import React from 'react';
import type { Page } from '../types';
import { HomeIcon, TasksIcon, TrackerIcon, SettingsIcon, PlusIcon } from './Icons';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  activePage: Page;
  onClick: (page: Page) => void;
  children: React.ReactNode;
  label: string;
}> = ({ page, activePage, onClick, children, label }) => {
  const isActive = activePage === page;
  return (
    <button
      onClick={() => onClick(page)}
      className={`flex flex-col items-center justify-center w-16 transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
    >
      {children}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  return (
    <nav className="sticky bottom-0 bg-slate-900/80 backdrop-blur-lg border-t border-slate-700 p-2">
      <div className="flex justify-around items-center h-16">
        <NavItem page="Home" activePage={activePage} onClick={onNavigate} label="Home">
          <HomeIcon />
        </NavItem>
        <NavItem page="Tasks" activePage={activePage} onClick={onNavigate} label="Tasks">
          <TasksIcon />
        </NavItem>

        <button 
          onClick={() => onNavigate('Add')}
          aria-label="Add new task"
          className="bg-cyan-500 hover:bg-cyan-600 rounded-full w-16 h-16 flex items-center justify-center -mt-8 shadow-lg shadow-cyan-500/30 ring-4 ring-slate-800"
        >
          <PlusIcon />
        </button>

        <NavItem page="Tracker" activePage={activePage} onClick={onNavigate} label="Tracker">
          <TrackerIcon />
        </NavItem>
        <NavItem page="Settings" activePage={activePage} onClick={onNavigate} label="Settings">
          <SettingsIcon />
        </NavItem>
      </div>
    </nav>
  );
};

export default BottomNav;