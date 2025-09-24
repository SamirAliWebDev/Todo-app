import React, { useState } from 'react';
import type { Page } from './types';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TrackerPage from './pages/TrackerPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Home');

  const renderContent = () => {
    switch (activePage) {
      case 'Home':
        return <HomePage />;
      case 'Tasks':
        return <TasksPage />;
      case 'Tracker':
        return <TrackerPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-[#0c1322] text-slate-200 min-h-screen flex flex-col font-sans antialiased">
      <main className="flex-grow p-6 overflow-y-auto overflow-x-hidden">
        <div key={activePage} className="page-enter-active">
          {renderContent()}
        </div>
      </main>
      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
};

export default App;