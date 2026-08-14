export type MarkStatus = 'p' | 'a' | 'c'; // 'p' = present, 'a' = absent (bunked), 'c' = cancelled

export type DayKind = 'pre' | 'post' | 'weekend' | 'diwali' | 'midterm' | 'holiday' | 'teaching';

export interface LectureSlot {
  s: string; // Subject Name (e.g. 'Energy Ecology')
  c: string; // Code (e.g. 'EE')
  t: string; // Start Time (HH:MM)
  e: string; // End Time (HH:MM)
}

export interface ScheduledLecture extends LectureSlot {
  k: string; // Date key 'YYYY-MM-DD'
  i: number; // Lecture index on that day
}

export type MarksMap = Record<string, Record<number, MarkStatus>>;

export interface AttendanceStats {
  R: number; // Remaining lectures scheduled (excluding cancelled)
  H: number; // Total semester held once complete (BASE_HELD + R)
  allowed: number; // Maximum bunks allowed to stay at or above target % (global pool)
  subjectSafeSum: number; // Sum of individual subject safe allowances (e.g. 15)
  subjectLeftSum: number; // Sum of remaining individual subject safe bunks
  cancelled: number; // Cancelled lectures marked
  absent: number; // Lectures bunked from TRACK_FROM onwards
  present: number; // Lectures attended from TRACK_FROM onwards
  pastUnmarked: number; // Unmarked lectures in the past (up to today)
  left: number; // Bunk budget remaining (allowed - absent)
  currentPct: number; // Attendance % held so far
  heldNow: number; // Total held so far (BASE_HELD + pastP + pastA)
  attNow: number; // Total attended so far (BASE_ATT + pastP)
  projected: number; // Projected final % if all remaining lectures are attended
}

export interface LiveLectureStatus {
  kicker: string;
  dot: string;
  subject: string;
  timeRange: string;
  progress: string; // e.g. "45%"
  meta: string; // e.g. "45 min to go" or "starts in 2 h 15 m"
  isLive: boolean;
  isWeekend?: boolean;
}

export interface SubjectStat {
  name: string;
  days: string;
  left: number;
  total: number;
  absent: number;
  safeAllowance: number;
  color: string;
  shadow: string;
  barPct: string;
  note: string;
}

export interface WeekTrend {
  weekKey: string;
  label: string;
  pct: number;
  pctLabel: string;
  heightPx: number;
  color: string;
  totalHeld: number;
  attended: number;
  isBaseline?: boolean;
}

export type TabId = 'calendar' | 'subjects' | 'trend';

export type FirebaseSyncState = 'idle' | 'connecting' | 'live' | 'error';
