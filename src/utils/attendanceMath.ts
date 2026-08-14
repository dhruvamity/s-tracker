import { DayKind, LectureSlot, ScheduledLecture, MarksMap, AttendanceStats, SubjectStat, WeekTrend, LiveLectureStatus } from '../types/attendance';
import { TIMETABLE } from '../constants/timetable';
import { TERM_START, TERM_END, TRACK_FROM, MIDTERM_WINDOW, DIWALI_BREAK, HOLIDAYS } from '../constants/calendar';
import { BASE_HELD, BASE_ATT, THEME_COLORS } from '../constants/config';
import { parseDateKey, formatDateKey, timeToMinutes, formatTimeRange } from './dateUtils';

export function getDayKind(dateKey: string): DayKind {
  if (dateKey < TERM_START) return 'pre';
  if (dateKey > TERM_END) return 'post';
  const dayOfWeek = parseDateKey(dateKey).getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend';
  if (dateKey >= DIWALI_BREAK[0] && dateKey <= DIWALI_BREAK[1]) return 'diwali';
  if (dateKey >= MIDTERM_WINDOW[0] && dateKey <= MIDTERM_WINDOW[1]) return 'midterm';
  if (HOLIDAYS[dateKey]) return 'holiday';
  return 'teaching';
}

export function getLecturesOnDate(dateKey: string): LectureSlot[] {
  if (getDayKind(dateKey) !== 'teaching') return [];
  const dayOfWeek = parseDateKey(dateKey).getDay();
  return TIMETABLE[dayOfWeek] || [];
}

let cachedSchedule: ScheduledLecture[] | null = null;
export function generateSemesterSchedule(): ScheduledLecture[] {
  if (cachedSchedule) return cachedSchedule;
  const list: ScheduledLecture[] = [];
  let curr = parseDateKey(TRACK_FROM);
  const end = parseDateKey(TERM_END);

  while (curr <= end) {
    const k = formatDateKey(curr);
    const lectures = getLecturesOnDate(k);
    lectures.forEach((lec, idx) => {
      list.push({ k, i: idx, ...lec });
    });
    curr = new Date(curr.getTime() + 86400000);
  }
  cachedSchedule = list;
  return list;
}

export function getMark(marks: MarksMap, dateKey: string, index: number) {
  return marks[dateKey]?.[index] || null;
}

export function calculateSubjectExposure(
  marks: MarksMap,
  targetPercent: number
): SubjectStat[] {
  const schedule = generateSemesterSchedule();
  const summary: Record<string, { total: number; absent: number; days: Record<string, boolean> }> = {};

  schedule.forEach((lec) => {
    const m = getMark(marks, lec.k, lec.i);
    if (!summary[lec.s]) {
      summary[lec.s] = { total: 0, absent: 0, days: {} };
    }
    if (m !== 'c') summary[lec.s].total++;
    if (m === 'a') summary[lec.s].absent++;

    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parseDateKey(lec.k).getDay()];
    summary[lec.s].days[dayName] = true;
  });

  return Object.keys(summary)
    .sort((a, b) => summary[b].total - summary[a].total)
    .map((name) => {
      const s = summary[name];
      const safeAllowance = Math.max(0, Math.floor(s.total * (1 - targetPercent / 100)));
      const left = Math.max(0, safeAllowance - s.absent);

      let color = THEME_COLORS.GREEN_BRIGHT;
      if (left === 0) color = THEME_COLORS.RED;
      else if (left <= 1) color = THEME_COLORS.AMBER;

      const shadow = left === 0
        ? `0 0 0 1px color-mix(in srgb, ${THEME_COLORS.RED} 45%, transparent)`
        : 'var(--shadow-sm)';

      const barPct = `${Math.round((safeAllowance ? left / safeAllowance : 0) * 100)}%`;
      const note = `${s.total} remaining · ${s.absent} missed · Max ${safeAllowance} skippable`;

      return {
        name,
        days: Object.keys(s.days).join(' · '),
        left,
        total: s.total,
        absent: s.absent,
        safeAllowance,
        color,
        shadow,
        barPct,
        note
      };
    });
}

export function calculateAttendanceStats(
  marks: MarksMap,
  targetPercent: number,
  nowIST: Date
): AttendanceStats {
  const todayKey = formatDateKey(nowIST);
  const schedule = generateSemesterSchedule();

  let cancelled = 0;
  let present = 0;
  let absent = 0;
  let pastUnmarked = 0;
  let pastP = 0;
  let pastA = 0;

  schedule.forEach((lec) => {
    const m = getMark(marks, lec.k, lec.i);
    if (m === 'c') cancelled++;
    else if (m === 'p') present++;
    else if (m === 'a') absent++;

    if (lec.k <= todayKey) {
      if (!m) pastUnmarked++;
      if (m === 'p') pastP++;
      if (m === 'a') pastA++;
    }
  });

  const R = schedule.length - cancelled;
  const H = BASE_HELD + R;
  const targetFraction = targetPercent / 100;
  const allowed = Math.max(0, Math.floor(BASE_ATT + R - targetFraction * H));
  const heldNow = BASE_HELD + pastP + pastA;
  const attNow = BASE_ATT + pastP;

  const currentPct = heldNow > 0 ? (attNow / heldNow) * 100 : 0;
  const projected = H > 0 ? ((BASE_ATT + R - absent) / H) * 100 : 0;
  const left = allowed - absent;

  const subjects = calculateSubjectExposure(marks, targetPercent);
  const subjectSafeSum = subjects.reduce((sum, s) => sum + s.safeAllowance, 0);
  const subjectLeftSum = subjects.reduce((sum, s) => sum + s.left, 0);

  return {
    R,
    H,
    allowed,
    subjectSafeSum,
    subjectLeftSum,
    cancelled,
    absent,
    present,
    pastUnmarked,
    left,
    currentPct,
    heldNow,
    attNow,
    projected
  };
}

export function calculateWeeklyTrends(
  marks: MarksMap,
  targetPercent: number
): WeekTrend[] {
  // Pre-loaded baseline weeks (July 20 to August 14) representing the 27/33 historical baseline
  const baselineWeeks: WeekTrend[] = [
    {
      weekKey: '2026-07-20',
      label: '20 Jul',
      pct: 85.7,
      pctLabel: '86%',
      heightPx: Math.max(6, Math.round(85.7 * 1.3)),
      color: THEME_COLORS.GREEN_BRIGHT,
      totalHeld: 7,
      attended: 6,
      isBaseline: true
    },
    {
      weekKey: '2026-07-27',
      label: '27 Jul',
      pct: 85.7,
      pctLabel: '86%',
      heightPx: Math.max(6, Math.round(85.7 * 1.3)),
      color: THEME_COLORS.GREEN_BRIGHT,
      totalHeld: 7,
      attended: 6,
      isBaseline: true
    },
    {
      weekKey: '2026-08-03',
      label: '3 Aug',
      pct: 75.0,
      pctLabel: '75%',
      heightPx: Math.max(6, Math.round(75.0 * 1.3)),
      color: THEME_COLORS.GREEN_BRIGHT,
      totalHeld: 8,
      attended: 6,
      isBaseline: true
    },
    {
      weekKey: '2026-08-10',
      label: '10 Aug',
      pct: 90.0,
      pctLabel: '90%',
      heightPx: Math.max(6, Math.round(90.0 * 1.3)),
      color: THEME_COLORS.GREEN_BRIGHT,
      totalHeld: 10,
      attended: 9,
      isBaseline: true
    }
  ];

  const schedule = generateSemesterSchedule();
  const byWeek: Record<string, { p: number; h: number; mondayDate: Date }> = {};

  schedule.forEach((lec) => {
    const m = getMark(marks, lec.k, lec.i);
    if (m !== 'p' && m !== 'a') return;

    const date = parseDateKey(lec.k);
    const dayOfWeek = (date.getDay() + 6) % 7; // Mon = 0, Sun = 6
    const monday = new Date(date.getTime() - dayOfWeek * 86400000);
    const weekKey = formatDateKey(monday);

    if (!byWeek[weekKey]) {
      byWeek[weekKey] = { p: 0, h: 0, mondayDate: monday };
    }
    byWeek[weekKey].h++;
    if (m === 'p') byWeek[weekKey].p++;
  });

  const recordedWeeks: WeekTrend[] = Object.keys(byWeek).sort().map((wk) => {
    const w = byWeek[wk];
    const pct = (w.p / w.h) * 100;
    const heightPx = Math.max(6, Math.round(pct * 1.3));

    let color = THEME_COLORS.GREEN_BRIGHT;
    if (pct < targetPercent - 10) {
      color = THEME_COLORS.RED;
    } else if (pct < targetPercent) {
      color = THEME_COLORS.AMBER;
    }

    return {
      weekKey: wk,
      label: `${w.mondayDate.getDate()} ${w.mondayDate.toLocaleDateString('en-GB', { month: 'short' })}`,
      pct,
      pctLabel: `${Math.round(pct)}%`,
      heightPx,
      color,
      totalHeld: w.h,
      attended: w.p,
      isBaseline: false
    };
  });

  // Combine baseline weeks with recorded active weeks
  const allWeeks = [...baselineWeeks, ...recordedWeeks];
  return allWeeks.slice(-8); // Show up to the latest 8 weeks
}

export function getLiveLectureStatus(nowIST: Date): LiveLectureStatus {
  const currentMinutes = nowIST.getHours() * 60 + nowIST.getMinutes();
  const todayKey = formatDateKey(nowIST);
  const todayLectures = getLecturesOnDate(todayKey);
  const dayOfWeek = nowIST.getDay(); // 0 = Sun, 6 = Sat, 5 = Fri
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // 1. Check if currently in class
  for (const lec of todayLectures) {
    const sMin = timeToMinutes(lec.t);
    const eMin = timeToMinutes(lec.e);
    if (currentMinutes >= sMin && currentMinutes < eMin) {
      const leftMinutes = eMin - currentMinutes;
      const progressFraction = (currentMinutes - sMin) / (eMin - sMin);
      const progress = `${Math.round(progressFraction * 100)}%`;
      const meta = leftMinutes >= 60
        ? `${Math.floor(leftMinutes / 60)} h ${leftMinutes % 60} m to go`
        : `${leftMinutes} min to go`;

      return {
        kicker: 'In class now',
        dot: THEME_COLORS.GREEN_BRIGHT,
        subject: lec.s,
        timeRange: formatTimeRange(lec.t, lec.e),
        progress,
        meta,
        isLive: true,
        isWeekend: false
      };
    }
  }

  // 2. Look forward up to 30 days for the next scheduled class
  for (let offset = 0; offset < 30; offset++) {
    const checkDate = new Date(nowIST.getTime() + offset * 86400000);
    const k = formatDateKey(checkDate);
    const lecs = getLecturesOnDate(k);

    for (const lec of lecs) {
      const sMin = timeToMinutes(lec.t);
      if (offset > 0 || sMin > currentMinutes) {
        const diffMinutes = offset * 1440 + sMin - currentMinutes;

        if (isWeekend || diffMinutes > 1440) {
          const targetDayName = checkDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
          return {
            kicker: `🌴 Next Class`,
            dot: 'var(--color-accent-400)',
            subject: lec.s,
            timeRange: `${targetDayName} • ${formatTimeRange(lec.t, lec.e)}`,
            progress: '0%',
            meta: '',
            isLive: false,
            isWeekend: true
          };
        }

        const when = offset === 0
          ? 'Today'
          : offset === 1
          ? 'Tomorrow'
          : checkDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

        return {
          kicker: `Up next`,
          dot: 'var(--color-accent-400)',
          subject: lec.s,
          timeRange: `${when} • ${formatTimeRange(lec.t, lec.e)}`,
          progress: '0%',
          meta: '',
          isLive: false,
          isWeekend: false
        };
      }
    }
  }

  return {
    kicker: 'Term complete',
    dot: 'var(--color-neutral-600)',
    subject: 'No lectures left',
    timeRange: '1 Dec 2026 was the last teaching day',
    progress: '100%',
    meta: 'Semester finished',
    isLive: false,
    isWeekend: false
  };
}
