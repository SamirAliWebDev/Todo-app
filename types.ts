export type Page = 'Home' | 'Tasks' | 'Add' | 'Tracker' | 'Settings';

export type Priority = 'Low' | 'Medium' | 'High';

export type PredefinedCategory = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Fitness' | 'Study' | 'Other';

export type TaskCategory = {
  type: 'icon';
  value: PredefinedCategory;
} | {
  type: 'emoji';
  value: string; // The emoji character
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  date: Date;
  category: TaskCategory;
  reminderTime?: string; // e.g., "14:30"
}

export type GraphOption = 'Completion' | 'Priority' | 'PerDay' | 'Streak';
export type GraphType = 'Bar' | 'Line' | 'Pie';
export interface GraphConfig {
  id: string;
  analysis: GraphOption;
  type: GraphType;
}

export type Theme = 'light' | 'dark';