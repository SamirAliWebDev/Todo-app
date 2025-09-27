import React from 'react';
import { ChevronLeftIcon, HeaderCloseIcon } from './Icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, onBack, onClose, children }) => {
  return (
    <header className="bg-white/90 dark:bg-slate-800/90 rounded-b-2xl px-4 pt-6 pb-4 border-b border-slate-200 dark:border-white/10 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center flex-1 min-w-0">
            {onBack && (
                <button onClick={onBack} className="p-2 -ml-2 mr-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex-shrink-0" aria-label="Go back">
                    <ChevronLeftIcon />
                </button>
            )}
            
            <div className={`flex-1 ${!onBack && !onClose ? 'text-center' : 'text-left'}`}>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white truncate">{title}</h1>
                {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{subtitle}</p>}
            </div>
        </div>
        
        {onClose && (
            <button 
                onClick={onClose} 
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 -mr-2 ml-4 flex-shrink-0"
                aria-label="Close"
            >
                <HeaderCloseIcon />
            </button>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
};

export default Header;