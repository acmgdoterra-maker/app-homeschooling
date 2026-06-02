import Dexie, { type Table } from 'dexie';
import type {
  Child,
  Subject,
  DailyRecord,
  CalendarEvent,
  Photo,
  HabitTracking,
  LearningEntry,
  BookRecord,
  DocumentaryRecord,
  PersonalGoal,
  HourTracking,
} from '../types';

export class HomeschoolingDB extends Dexie {
  children!: Table<Child>;
  subjects!: Table<Subject>;
  dailyRecords!: Table<DailyRecord>;
  calendarEvents!: Table<CalendarEvent>;
  photos!: Table<Photo>;
  habitTracking!: Table<HabitTracking>;
  learningEntries!: Table<LearningEntry>;
  bookRecords!: Table<BookRecord>;
  documentaryRecords!: Table<DocumentaryRecord>;
  personalGoals!: Table<PersonalGoal>;
  hourTracking!: Table<HourTracking>;

  constructor() {
    super('homeschoolingDB');
    this.version(1).stores({
      children: 'id',
      subjects: 'id, childId',
      dailyRecords: 'id, childId, date',
      calendarEvents: 'id, childId, date',
      photos: 'id, childId, date',
      habitTracking: 'id, childId, date',
      learningEntries: 'id, childId, date',
      bookRecords: 'id, childId',
      documentaryRecords: 'id, childId, date',
      personalGoals: 'id, childId',
      hourTracking: 'id, childId, date',
    });
  }
}

export const db = new HomeschoolingDB();
