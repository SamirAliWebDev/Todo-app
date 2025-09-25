export type Page = 'Home' | 'Tasks' | 'Add' | 'Tracker' | 'Settings';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
}
