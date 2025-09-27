import React, { useState, useEffect } from 'react';
import { ClockIcon, StreakIcon } from '../components/Icons';
import type { Task } from '../types';
import AwardModal from '../components/AwardModal';

const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Well done is better than well said.", author: "Benjamin Franklin" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" }
];

const StatCard: React.FC<{ icon: React.ReactNode; label: string; count: number }> = ({ icon, label, count }) => (
  <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 border border-slate-200 dark:border-white/10 shadow-lg shadow-black/20 text-slate-700 dark:text-slate-300">
    {icon}
    <span className="text-4xl font-bold text-slate-900 dark:text-white">{count}</span>
    <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
  </div>
);

const isSameDay = (d1: Date, d2: Date) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
};

const calculateCurrentStreak = (tasks: Task[]): number => {
    if (!tasks || tasks.length === 0) {
        return 0;
    }

    // Get unique, normalized dates for completed tasks, sorted in descending order
    const completedTimestamps = [
        ...new Set(
            tasks
                .filter(t => t.completed)
                .map(t => {
                    const d = new Date(t.date);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime();
                })
        )
    ].sort((a, b) => b - a);

    if (completedTimestamps.length === 0) {
        return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // The streak is only "current" if the most recent completion was today or yesterday.
    // If it was earlier, the streak has been broken.
    const mostRecentCompletionTime = completedTimestamps[0];
    if (mostRecentCompletionTime < yesterday.getTime()) {
        return 0;
    }
    
    let streak = 0;
    // Start checking for consecutive days from the most recent completed day.
    let expectedDate = new Date(mostRecentCompletionTime);

    // Loop through all completed timestamps and count how many are consecutive from the start.
    for (const timestamp of completedTimestamps) {
        if (timestamp === expectedDate.getTime()) {
            streak++;
            // Set the next expected date to the day before.
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            // The sequence of consecutive days is broken.
            break;
        }
    }

    return streak;
};

interface HomePageProps {
  tasks: Task[];
}

const HomePage: React.FC<HomePageProps> = ({ tasks }) => {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(currentDate);
  
  const todaysTasks = tasks.filter(task => isSameDay(task.date, currentDate));

  const completedTasks = todaysTasks.filter(task => task.completed).length;
  const pendingTasks = todaysTasks.length - completedTasks;
  const greeting = getGreeting();
  const currentStreak = calculateCurrentStreak(tasks);
  const [showAwardModal, setShowAwardModal] = useState(false);

  // Get daily quote
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const quoteIndex = (dayOfYear - 1) % quotes.length;
  const dailyQuote = quotes[quoteIndex];

  useEffect(() => {
    // Check if the user has achieved a 7-day streak and hasn't been awarded for this specific streak instance.
    if (currentStreak === 7) {
      const lastAwardedDateStr = localStorage.getItem('last7DayAwardDate');
      
      // Find the most recent date a task was completed
      const mostRecentCompletion = tasks
        .filter(t => t.completed)
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      
      if (mostRecentCompletion) {
        const mostRecentDateStr = mostRecentCompletion.date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // If we haven't awarded for this date yet, show the modal.
        if (lastAwardedDateStr !== mostRecentDateStr) {
          setShowAwardModal(true);
          localStorage.setItem('last7DayAwardDate', mostRecentDateStr);
        }
      }
    }
  }, [currentStreak, tasks]);

  const handleCloseModal = () => {
    setShowAwardModal(false);
  };

  return (
    <>
        <div className="p-6 flex flex-col h-full text-center space-y-8">
            <header className="content-fade-in-active" style={{ animationDelay: '100ms' }}>
                <p className="text-xl font-semibold text-amber-400 dark:text-glow-amber">{greeting}</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mt-1">Welcome to Zenith</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">{formattedDate}</p>
            </header>

            <section className="grid grid-cols-2 gap-6 content-fade-in-active" style={{ animationDelay: '200ms' }}>
                <StatCard icon={<ClockIcon />} label="Pending Today" count={pendingTasks} />
                <StatCard icon={<StreakIcon className="h-8 w-8 text-yellow-500" />} label="Current Streak" count={currentStreak} />
            </section>

            <footer className="content-fade-in-active mt-auto" style={{ animationDelay: '300ms' }}>
                <blockquote className="italic">
                <p className="text-amber-800 dark:text-amber-200">"{dailyQuote.text}"</p>
                <cite className="text-amber-700 dark:text-amber-300 not-italic block mt-2">- {dailyQuote.author}</cite>
                </blockquote>
            </footer>
        </div>
        
        {showAwardModal && (
            <AwardModal 
                onClose={handleCloseModal}
                title="7-Day Streak!"
                message="Incredible consistency! You've completed tasks for 7 days in a row. Keep up the amazing work!"
            />
        )}
    </>
  );
};

export default HomePage;