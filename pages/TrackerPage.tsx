import React, { useState, useMemo } from 'react';
import type { Task, GraphOption, GraphType, GraphConfig } from '../types';
import { GraphIcon, BarChartIcon, LineChartIcon, PieChartIcon, StreakIcon } from '../components/Icons';
import { BarChart, LineChart, PieChart } from '../components/Charts';

type ModalStep = 'analysis' | 'type';

// Helper function to check if two dates are the same day
const isSameDay = (d1: Date, d2: Date) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

const analysisOptions: { id: GraphOption; label: string }[] = [
  { id: 'Completion', label: "Today's Completion Rate" },
  { id: 'Priority', label: 'Priority Distribution (All Tasks)' },
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
  generatedGraphs: GraphConfig[];
  onGenerateGraph: (config: Omit<GraphConfig, 'id'>) => void;
  onDeleteGraph: (graphId: string) => void;
}

const GraphDisplay: React.FC<{
  tasks: Task[];
  config: GraphConfig;
  onClose: () => void;
}> = ({ tasks, config, onClose }) => {
  const analysisTitle = analysisOptions.find(opt => opt.id === config.analysis)?.label || '';
  
  const chartData = useMemo(() => {
    if (!tasks.length) return [];

    switch (config.analysis) {
      case 'Completion':
        const today = new Date();
        const todaysTasks = tasks.filter(task => isSameDay(task.date, today));
        const completed = todaysTasks.filter(t => t.completed).length;
        return [
          { label: 'Completed', value: completed, color: '#22c55e' },
          { label: 'Pending', value: todaysTasks.length - completed, color: '#ef4444' },
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
                color: '#06b6d4',
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
        }))].sort((a, b) => Number(a) - Number(b));
    
    if (completedDates.length === 0) return 0;
    
    let maxStreak = 1;
    let currentStreak = 1;
    for (let i = 1; i < completedDates.length; i++) {
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
        return <p className="text-slate-400 text-center py-10">No data available for this analysis.</p>;
    }
    
    switch (config.type) {
        case 'Bar': return <BarChart data={chartData} />;
        case 'Line': return <LineChart data={chartData} />;
        case 'Pie': return <PieChart data={chartData} />;
        default: return null;
    }
  };

  return (
    <div className="w-full bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl shadow-black/25 content-fade-in-active">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">{analysisTitle}</h3>
            <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-white transition-colors"
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
                <span className="text-6xl font-extrabold text-white mt-2">{productivityStreak}</span>
                <span className="text-lg text-slate-300 font-medium">Day Streak</span>
            </div>
        ) : (
            <div className="h-64 flex items-center justify-center">
                {renderChart()}
            </div>
        )}
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
        className="modal-content w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-white transition-colors"
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
                  className="w-full text-left p-4 rounded-lg font-semibold transition-colors duration-200 bg-slate-700 text-slate-200 border border-slate-600 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  {label}
                </button>
              ))
          ) : (
            graphTypes.map(({ id, label, icon }) => (
                <button
                    key={id}
                    onClick={() => onSelectGraphType(id)}
                    className="w-full flex items-center p-4 rounded-lg font-semibold transition-colors duration-200 bg-slate-700 text-slate-200 border border-slate-600 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400"
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

const TrackerPage: React.FC<TrackerPageProps> = ({ tasks, generatedGraphs, onGenerateGraph, onDeleteGraph }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('analysis');
  const [selectedAnalysis, setSelectedAnalysis] = useState<GraphOption | null>(null);
  const canAddGraph = generatedGraphs.length < 4;

  const openModal = () => {
    if (!canAddGraph) return;
    setModalStep('analysis');
    setIsModalVisible(true);
  };

  const closeModal = (callback?: () => void) => {
    setIsModalVisible(false);
    setModalStep('analysis');
    setSelectedAnalysis(null);
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
      <div className="flex flex-col items-center text-center pt-8 p-6">
        <h1 className="text-5xl font-extrabold text-white">Tracker</h1>
        <p className="text-slate-400 mt-2">Track your progress and productivity.</p>

        <div className="w-full max-w-md">
            <div className="w-full mt-12 bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl shadow-black/25 content-fade-in-active">
                <h2 className="text-2xl font-bold text-white">Productivity Insights</h2>
                <p className="text-slate-300 mt-3 mb-6">
                    Generate up to 4 graphs to visualize your task trends and track your progress.
                </p>
                <button
                    onClick={openModal}
                    disabled={!canAddGraph}
                    className="w-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-cyan-500/30 transition-all active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    <GraphIcon />
                    {canAddGraph ? 'Generate Graph' : 'Graph Limit Reached (4)'}
                </button>
            </div>
            
            <div className="mt-8 grid gap-8">
                {generatedGraphs.map(graph => (
                    <GraphDisplay
                        key={graph.id}
                        tasks={tasks}
                        config={graph}
                        onClose={() => onDeleteGraph(graph.id)}
                    />
                ))}
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
    </>
  );
};

export default TrackerPage;