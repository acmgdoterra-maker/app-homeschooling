export interface Child {
  id: string;
  name: string;
  birthDate: string;
  color: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  childId: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface DailyRecord {
  id: string;
  childId: string;
  date: string;
  subjectId: string;
  description: string;
  checklistItems: ChecklistItem[];
  reinforcements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  childId: string;
  date: string;
  title: string;
  description: string;
  type: 'activity' | 'trip' | 'museum' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  childId: string;
  recordId?: string;
  date: string;
  title: string;
  description: string;
  data: string; // base64
  createdAt: string;
}

export interface HabitTracking {
  id: string;
  childId: string;
  date: string;
  habits: {
    autonomy: number; // 1-5
    chores: number; // 1-5
    lifestyle: number; // 1-5
  };
  notes: string;
  createdAt: string;
}

export interface LearningEntry {
  id: string;
  childId: string;
  date: string;
  entry: string;
  mood?: string;
  createdAt: string;
}

export interface BookRecord {
  id: string;
  childId: string;
  title: string;
  author: string;
  dateCheckedOut: string;
  dateReturned?: string;
  notes: string;
  createdAt: string;
}

export interface DocumentaryRecord {
  id: string;
  childId: string;
  title: string;
  date: string;
  subject: string;
  notes: string;
  createdAt: string;
}

export interface PersonalGoal {
  id: string;
  childId: string;
  goal: string;
  startDate: string;
  targetDate: string;
  progress: number; // 0-100
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface HourTracking {
  id: string;
  childId: string;
  date: string;
  subjectId: string;
  hours: number;
  notes: string;
  createdAt: string;
}
