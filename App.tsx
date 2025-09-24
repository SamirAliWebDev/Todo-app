import React, { useState } from 'react';
import type { Page } from './types';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TrackerPage from './pages/TrackerPage';
import SettingsPage from './pages/SettingsPage';

const getEnterAnimationClass = (page: Page) => {
  switch (page) {
    case 'Home':
      return 'page-home-enter-active';
    default:
      return 'page-enter-active';
  }
};

const getExitAnimationClass = (page: Page) => {
  switch (page) {
    case 'Home':
      return 'page-home-exit-active';
    default:
      return 'page-exit-active';
  }
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Home');
  const [animationClass, setAnimationClass] = useState<string>(getEnterAnimationClass('Home'));
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getAnimationDuration = (page: Page) => (page === 'Home' ? 600 : 300);

  const onNavigate = (page: Page) => {
    if (page === activePage || isTransitioning) return;

    setIsTransitioning(true);
    setAnimationClass(getExitAnimationClass(activePage));
    
    const exitDuration = getAnimationDuration(activePage);
    const enterDuration = getAnimationDuration(page);

    // Wait for the exit animation to finish
    setTimeout(() => {
      // Switch the page and trigger the enter animation
      setActivePage(page);
      setAnimationClass(getEnterAnimationClass(page));

      // Wait for the enter animation to finish before allowing another navigation
      setTimeout(() => {
        setIsTransitioning(false);
      }, enterDuration);
    }, exitDuration);
  };

  const renderPage = (page: Page) => {
    switch (page) {
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
      <main className="flex-grow relative overflow-hidden">
        <div
          key={activePage}
          className={`w-full h-full p-6 absolute inset-0 overflow-y-auto scrollbar-hide ${animationClass}`}
        >
          {renderPage(activePage)}
        </div>
      </main>
      <BottomNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  );
};

export default App;