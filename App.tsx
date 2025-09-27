import React, { useState, useEffect, useRef } from 'react';
import type { Page, Task, GraphConfig, Theme, TaskCategory, PredefinedCategory } from './types';
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
        // Ensure date strings are converted back to Date objects and handle category migration
        return parsedTasks.map((task: any) => {
          let category: TaskCategory;

          if (typeof task.category === 'string') {
            // Old format: "Work", "Personal", etc.
            category = { type: 'icon', value: task.category as PredefinedCategory };
          } else if (task.category && typeof task.category === 'object' && 'type' in task.category && 'value' in task.category) {
            // New format, already an object
            category = task.category;
          } else {
            // Default for tasks created before categories or with corrupted data
            category = { type: 'icon', value: 'Other' };
          }
          
          return {
            ...task,
            date: new Date(task.date),
            category,
          };
        });
      }
      // If no saved tasks, initialize with an empty array.
      return [];
    } catch (error) {
      console.error('Failed to load tasks from localStorage', error);
      // Fallback to an empty array on error.
      return [];
    }
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const notificationTimeouts = useRef<Record<string, number>>({});

  useEffect(() => {
    // Clear all previously scheduled notifications on any task change
    Object.values(notificationTimeouts.current).forEach(clearTimeout);
    notificationTimeouts.current = {};

    // Only schedule new notifications if permission has been granted
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      tasks.forEach(task => {
        // Schedule for tasks that have a reminder, are not completed, and are in the future
        if (task.reminderTime && !task.completed) {
          const [hours, minutes] = task.reminderTime.split(':').map(Number);
          const reminderDateTime = new Date(task.date);
          reminderDateTime.setHours(hours, minutes, 0, 0);

          const now = new Date();
          if (reminderDateTime > now) {
            const timeoutDuration = reminderDateTime.getTime() - now.getTime();
            const timeoutId = window.setTimeout(() => {
              // Using a ref to get the latest task state to ensure we don't notify for tasks completed while waiting for the timeout
              const currentTask = tasksRef.current.find(t => t.id === task.id);
              if (currentTask && !currentTask.completed) {
                  new Notification('Zenith: Task Reminder', {
                    body: task.title,
                    icon: '/vite.svg', // Using the vite icon from index.html
                  });
              }
              delete notificationTimeouts.current[task.id];
            }, timeoutDuration);
            notificationTimeouts.current[task.id] = timeoutId;
          }
        }
      });
    }

    // Cleanup function to clear timeouts when the component unmounts
    return () => {
      Object.values(notificationTimeouts.current).forEach(clearTimeout);
    };
  }, [tasks]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage', error);
    }
  }, [tasks]);

  const [animationClass, setAnimationClass] = useState<string>(getEnterAnimationClass('Home'));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [generatedGraphs, setGeneratedGraphs] = useState<GraphConfig[]>([]);

  const handleGenerateGraph = (config: Omit<GraphConfig, 'id'>) => {
    if (generatedGraphs.length >= 4) return; // Enforce limit of 4 graphs
    const newGraph: GraphConfig = {
      ...config,
      id: Date.now().toString(), // Add a unique ID
    };
    setGeneratedGraphs(prevGraphs => [...prevGraphs, newGraph]);
  };
  
  const handleDeleteGraph = (graphId: string) => {
    setGeneratedGraphs(prevGraphs => prevGraphs.filter(graph => graph.id !== graphId));
  };


  const onNavigate = (page: Page) => {
    if (page === activePage || isTransitioning) return;
    
    if (activePage === 'Add') {
      setTaskToEdit(null);
    }

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

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
    setTaskToEdit(null);
  };

  const handleStartEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTaskToEdit(task);
      onNavigate('Add');
    }
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
        return <TasksPage tasks={tasks} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} onEditTask={handleStartEditTask} selectedDate={selectedDate} onDateSelect={setSelectedDate} />;
      case 'Add':
        return <AddOrEditTaskPage onNavigate={onNavigate} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} selectedDate={selectedDate} taskToEdit={taskToEdit} />;
      case 'Tracker':
        return <TrackerPage tasks={tasks} generatedGraphs={generatedGraphs} onGenerateGraph={handleGenerateGraph} onDeleteGraph={handleDeleteGraph} />;
      case 'Settings':
        return <SettingsPage theme={theme} setTheme={setTheme} />;
      default:
        return <HomePage tasks={tasks} />;
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 dark:from-slate-900 dark:to-slate-800 dark:text-slate-300 min-h-screen flex flex-col font-sans antialiased">
      <main className="flex-grow relative overflow-hidden">
        <div
          key={activePage}
          className={`w-full h-full absolute inset-0 overflow-y-auto scrollbar-hide ${animationClass}`}
        >
          {renderPage(activePage)}
        </div>
      </main>
      <BottomNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  );
};

export default App;
