export interface ScheduleItem {
  time: string;
  activity: string;
  duration: string;
}

export interface PresentationSlot {
  id: number;
  time: string;
  studentName: string | null;
}

export interface Student {
  id: number;
  name: string;
}

export enum LotteryRole {
  NoteTaker = '紀錄同學',
  Videographer = '錄影同學',
  CleaningDuty = '打掃',
}

export interface LotteryWinner {
  role: LotteryRole;
  student: Student;
}