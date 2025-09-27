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
      className={`flex flex-col items-center justify-center w-16 transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
    >
      {children}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const isAddPage = activePage === 'Add';
  
  return (
    <nav className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-700 p-2">
      <div className="flex justify-around items-center h-16">
        <NavItem page="Home" activePage={activePage} onClick={onNavigate} label="Home">
          <HomeIcon />
        </NavItem>
        <NavItem page="Tasks" activePage={activePage} onClick={onNavigate} label="Tasks">
          <TasksIcon />
        </NavItem>

        <button 
          onClick={() => onNavigate(isAddPage ? 'Home' : 'Add')}
          aria-label={isAddPage ? "Close add task page" : "Add new task"}
          className={`
            rounded-full w-16 h-16 flex items-center justify-center -mt-8 shadow-lg ring-4 ring-slate-200 dark:ring-slate-800 
            transition-all duration-300 ease-in-out
            ${isAddPage 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                : 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/30'
            }
          `}
        >
          <div className={`transition-transform duration-300 ease-in-out ${isAddPage ? 'rotate-[135deg]' : ''}`}>
            <PlusIcon />
          </div>
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