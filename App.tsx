import React, { useState, useEffect } from 'react';
import type { Page, Task, GraphConfig } from './types';
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
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Ensure date strings are converted back to Date objects
        return parsedTasks.map((task: Omit<Task, 'date'> & { date: string }) => ({
          ...task,
          date: new Date(task.date),
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to load tasks from localStorage', error);
      return [];
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage', error);
    }
  }, [tasks]);

  const [animationClass, setAnimationClass] = useState<string>(getEnterAnimationClass('Home'));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [generatedGraph, setGeneratedGraph] = useState<GraphConfig | null>(null);
  const [animateGraph, setAnimateGraph] = useState(false);

  const handleAnimationDone = () => {
    setAnimateGraph(false);
  };

  const handleGenerateGraph = (config: GraphConfig | null) => {
    if (config && JSON.stringify(config) !== JSON.stringify(generatedGraph)) {
      setAnimateGraph(true);
    }
    setGeneratedGraph(config);
  };

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

  const handleAddTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask].sort((a, b) => Number(a.id) - Number(b.id)));
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
        return <TasksPage tasks={tasks} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} selectedDate={selectedDate} onDateSelect={setSelectedDate} />;
      case 'Add':
        return <AddOrEditTaskPage onNavigate={onNavigate} onAddTask={handleAddTask} selectedDate={selectedDate} />;
      case 'Tracker':
        return <TrackerPage tasks={tasks} generatedGraph={generatedGraph} onGenerateGraph={handleGenerateGraph} animateGraph={animateGraph} onAnimationDone={handleAnimationDone} />;
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