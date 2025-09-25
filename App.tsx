import React, { useState } from 'react';
import type { Page, Task } from './types';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TrackerPage from './pages/TrackerPage';
import SettingsPage from './pages/SettingsPage';
import AddOrEditTaskPage from './pages/AddOrEditTaskPage';

const getEnterAnimationClass = (page: Page) => {
  switch (page) {
    case 'Home':
      return 'page-home-enter-active';
    case 'Add':
      return 'page-add-enter-active';
    default:
      return 'page-enter-active';
  }
};

const getExitAnimationClass = (page: Page) => {
  switch (page) {
    case 'Home':
      return 'page-home-exit-active';
    case 'Add':
      return 'page-add-exit-active';
    default:
      return 'page-exit-active';
  }
};

const getEnterDuration = (page: Page) => {
  switch (page) {
    case 'Home': return 500;
    case 'Add': return 400;
    default: return 300;
  }
};
const getExitDuration = (page: Page) => {
  switch (page) {
    case 'Add': return 300;
    default: return 150;
  }
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Home');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [animationClass, setAnimationClass] = useState<string>(getEnterAnimationClass('Home'));
  const [isTransitioning, setIsTransitioning] = useState(false);

  const onNavigate = (page: Page) => {
    if (page === activePage || isTransitioning) return;

    setIsTransitioning(true);
    setAnimationClass(getExitAnimationClass(activePage));
    
    const exitDuration = getExitDuration(activePage);
    const enterDuration = getEnterDuration(page);

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

  const handleAddTask = (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
    };
    setTasks(prevTasks => [...prevTasks, newTask].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const renderPage = (page: Page) => {
    switch (page) {
      case 'Home':
        return <HomePage tasks={tasks} />;
      case 'Tasks':
        return <TasksPage tasks={tasks} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />;
      case 'Add':
        return <AddOrEditTaskPage onNavigate={onNavigate} onAddTask={handleAddTask} />;
      case 'Tracker':
        return <TrackerPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <HomePage tasks={tasks} />;
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-200 text-slate-800 min-h-screen flex flex-col font-sans antialiased">
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