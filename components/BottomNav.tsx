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
      className={`
        flex items-center justify-center h-12 rounded-full transition-all duration-300 ease-in-out
        group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-slate-800
        ${isActive 
            ? 'bg-amber-500 text-white px-5 shadow-md shadow-amber-500/30' 
            : 'w-12 text-slate-500 dark:text-slate-400 hover:bg-slate-500/10'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
      <span className={`
        overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap
        ${isActive ? 'max-w-xs ml-2 text-sm font-semibold' : 'max-w-0 ml-0'}
      `}>
        {label}
      </span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const isAddPage = activePage === 'Add';
  
  return (
    <nav className="fixed bottom-0 inset-x-0 h-28 flex justify-center items-center z-50 pointer-events-none">
        <div className="relative pointer-events-auto">
            {/* Floating pill background */}
            <div className="
                flex items-center gap-2 p-2 
                bg-white/80 dark:bg-slate-800/80
                backdrop-blur-xl
                rounded-full 
                shadow-2xl shadow-black/25
                border border-slate-200 dark:border-white/10
            ">
                <NavItem page="Home" activePage={activePage} onClick={onNavigate} label="Home">
                  <HomeIcon />
                </NavItem>
                <NavItem page="Tasks" activePage={activePage} onClick={onNavigate} label="Tasks">
                  <TasksIcon />
                </NavItem>
                
                {/* Central Add Button - Integrated */}
                <button 
                    onClick={() => onNavigate(isAddPage ? 'Home' : 'Add')}
                    aria-label={isAddPage ? "Close add task page" : "Add new task"}
                    className={`
                      rounded-full w-14 h-14 flex items-center justify-center
                      transition-all duration-300 ease-in-out transform hover:scale-110
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2
                      dark:focus-visible:ring-offset-slate-800
                      ${isAddPage 
                          ? 'bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/30' 
                          : 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/40'
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
        </div>
    </nav>
  );
};

export default BottomNav;