import React, { useState, useMemo, useEffect } from 'react';
import type { Task, GraphOption, GraphType, GraphConfig } from '../types';
import { GraphIcon, BarChartIcon, LineChartIcon, PieChartIcon, StreakIcon } from '../components/Icons';
import { BarChart, LineChart, PieChart } from '../components/Charts';

type ModalStep = 'analysis' | 'type';

const analysisOptions: { id: GraphOption; label: string }[] = [
  { id: 'Completion', label: 'Task Completion Rate' },
  { id: 'Priority', label: 'Priority Distribution' },
  { id: 'PerDay', label: 'Tasks Over Time' },
  { id: 'Streak', label: 'Productivity Streak' },
];

const graphTypes: { id: GraphType, label: string, icon: React.ReactNode }[] = [
    { id: 'Bar', label: 'Bar Chart', icon: <BarChartIcon className="h-5 w-5 mr-2" /> },
    { id: 'Line', label: 'Line Chart', icon: <LineChartIcon className="h-5 w-5 mr-2" /> },
    { id: 'Pie', label: 'Pie Chart', icon: <PieChartIcon className="h-5 w-5 mr-2" /> },
];

interface TrackerPageProps {
  tasks: Task[];
  generatedGraph: GraphConfig | null;
  onGenerateGraph: (config: GraphConfig | null) => void;
}

const GraphViewModal: React.FC<{
  tasks: Task[];
  config: GraphConfig;
  onClose: () => void;
}> = ({ tasks, config, onClose }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setTimeout(() => setAnimationClass('modal-enter'), 10);
  }, []);

  const handleClose = () => {
    setAnimationClass('modal-exit');
    setTimeout(onClose, 200); // Wait for animation
  };

  const analysisTitle = analysisOptions.find(opt => opt.id === config.analysis)?.label || '';
  
  const chartData = useMemo(() => {
    if (!tasks.length) return [];

    switch (config.analysis) {
      case 'Completion':
        const completed = tasks.filter(t => t.completed).length;
        return [
          { label: 'Completed', value: completed, color: '#22c55e' },
          { label: 'Pending', value: tasks.length - completed, color: '#ef4444' },
        ];
      case 'Priority':
        const priorityMap = tasks.reduce((acc, task) => {
          acc[task.priority] = (acc[task.priority] || 0) + 1;
          return acc;
        }, {} as Record<Task['priority'], number>);
        return [
          { label: 'High', value: priorityMap.High || 0, color: '#ef4444' },
          { label: 'Medium', value: priorityMap.Medium || 0, color: '#f59e0b' },
          { label: 'Low', value: priorityMap.Low || 0, color: '#22c55e' },
        ].filter(item => item.value > 0);
      case 'PerDay': {
        const completedTasksPerDay = tasks
          .filter(task => task.completed)
          .reduce((acc, task) => {
            const taskDate = new Date(task.date);
            const year = taskDate.getFullYear();
            const month = String(taskDate.getMonth() + 1).padStart(2, '0');
            const day = String(taskDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            
            acc.set(dateString, (acc.get(dateString) || 0) + 1);
            return acc;
          }, new Map<string, number>());
        
        if (completedTasksPerDay.size === 0) return [];
        
        const sortedDates = Array.from(completedTasksPerDay.keys()).sort();

        return sortedDates.map(dateString => {
            const date = new Date(`${dateString}T00:00:00`);
            const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return {
                label,
                value: completedTasksPerDay.get(dateString) || 0,
                color: '#3b82f6',
            };
        });
      }
      default:
        return [];
    }
  }, [tasks, config.analysis]);

  const productivityStreak = useMemo(() => {
    if (config.analysis !== 'Streak') return 0;
    const completedDates = [...new Set(tasks
        .filter(t => t.completed)
        .map(t => {
            const d = new Date(t.date);
            d.setHours(0,0,0,0);
            return d.getTime();
        // FIX: Explicitly cast to Number to prevent type errors during subtraction.
        }))].sort((a, b) => Number(a) - Number(b));
    
    if (completedDates.length === 0) return 0;
    
    let maxStreak = 1;
    let currentStreak = 1;
    for (let i = 1; i < completedDates.length; i++) {
        // FIX: Explicitly cast to Number to prevent type errors during subtraction.
        const diff = (Number(completedDates[i]) - Number(completedDates[i-1])) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
            currentStreak++;
        } else {
            maxStreak = Math.max(maxStreak, currentStreak);
            currentStreak = 1;
        }
    }
    return Math.max(maxStreak, currentStreak);
  }, [tasks, config.analysis]);
  
  const renderChart = () => {
    if (!chartData || chartData.length === 0 || chartData.every(d => d.value === 0)) {
        return <p className="text-slate-500 text-center py-10">No data available for this analysis.</p>;
    }
    
    switch (config.type) {
        case 'Bar': return <BarChart data={chartData} />;
        case 'Line': return <LineChart data={chartData} />;
        case 'Pie': return <PieChart data={chartData} />;
        default: return null;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${animationClass}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="graph-modal-title"
    >
      <div
        className="modal-content w-full max-w-lg bg-slate-50 rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h3 id="graph-modal-title" className="text-xl font-bold text-slate-800">{analysisTitle}</h3>
            <button 
                onClick={handleClose} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
         {config.analysis === 'Streak' ? (
            <div className="flex flex-col items-center justify-center p-4">
                <StreakIcon className="h-12 w-12 text-yellow-500" />
                <span className="text-6xl font-extrabold text-slate-900 mt-2">{productivityStreak}</span>
                <span className="text-lg text-slate-500 font-medium">Day Streak</span>
            </div>
        ) : (
            <div className="h-64 flex items-center justify-center">
                {renderChart()}
            </div>
        )}
      </div>
    </div>
  );
};


const GraphOptionsModal: React.FC<{
  onClose: () => void;
  onSelectAnalysis: (option: GraphOption) => void;
  onSelectGraphType: (type: GraphType) => void;
  step: ModalStep;
}> = ({ onClose, onSelectAnalysis, onSelectGraphType, step }) => {
    const title = step === 'analysis' ? 'How would you like to visualize?' : 'Choose a Chart Type';
    
    return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="modal-content w-full max-w-sm bg-slate-50 rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="space-y-3">
          {step === 'analysis' ? (
             analysisOptions.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onSelectAnalysis(id)}
                  className="w-full text-left p-4 rounded-lg font-semibold transition-colors duration-200 bg-white/60 text-slate-700 border border-slate-200 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700"
                >
                  {label}
                </button>
              ))
          ) : (
            graphTypes.map(({ id, label, icon }) => (
                <button
                    key={id}
                    onClick={() => onSelectGraphType(id)}
                    className="w-full flex items-center p-4 rounded-lg font-semibold transition-colors duration-200 bg-white/60 text-slate-700 border border-slate-200 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700"
                >
                    {icon}
                    {label}
                </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TrackerPage: React.FC<TrackerPageProps> = ({ tasks, generatedGraph, onGenerateGraph }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('analysis');
  const [selectedAnalysis, setSelectedAnalysis] = useState<GraphOption | null>(null);

  const openModal = () => {
    setModalStep('analysis');
    setIsModalVisible(true);
  };

  const closeModal = (callback?: () => void) => {
    setIsModalVisible(false);
    setModalStep('analysis');
    if (callback) callback();
  };

  const handleAnalysisSelect = (option: GraphOption) => {
    setSelectedAnalysis(option);
    if (option === 'Streak') {
        // Streak is not a chart, so we skip the type selection
        closeModal(() => {
            onGenerateGraph({ analysis: option, type: 'Bar' }); // Type doesn't matter here
        });
    } else {
        setModalStep('type');
    }
  };

  const handleGraphTypeSelect = (type: GraphType) => {
    if (!selectedAnalysis) return;
    closeModal(() => {
        onGenerateGraph({ analysis: selectedAnalysis, type });
    });
  };

  return (
    <>
      <div className="flex flex-col items-center text-center pt-8">
        <h1 className="text-5xl font-extrabold text-slate-900">Tracker</h1>
        <p className="text-slate-500 mt-2">Track your progress and productivity.</p>

        <div className="w-full max-w-md">
            <div className="w-full mt-12 bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-slate-200/50 content-fade-in-active">
                <h2 className="text-2xl font-bold text-slate-900">Productivity Insights</h2>
                <p className="text-slate-500 mt-3 mb-6">
                    Generate a graph to visualize your task trends and track your progress over time.
                </p>
                <button
                    onClick={openModal}
                    className="w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-500/30 transition-none active:scale-100"
                >
                    <GraphIcon />
                    Generate Graph
                </button>
            </div>
        </div>
      </div>

      {isModalVisible && (
        <GraphOptionsModal
            onClose={() => closeModal()}
            onSelectAnalysis={handleAnalysisSelect}
            onSelectGraphType={handleGraphTypeSelect}
            step={modalStep}
        />
      )}
      
      {generatedGraph && (
        <GraphViewModal
            tasks={tasks}
            config={generatedGraph}
            onClose={() => onGenerateGraph(null)}
        />
      )}
    </>
  );
};

export default TrackerPage;