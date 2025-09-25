export type Page = 'Home' | 'Tasks' | 'Add' | 'Tracker' | 'Settings';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  date: Date;
}

export type GraphOption = 'Completion' | 'Priority' | 'PerDay' | 'Streak';
export type GraphType = 'Bar' | 'Line' | 'Pie';
export interface GraphConfig {
  id: string;
  analysis: GraphOption;
  type: GraphType;
}