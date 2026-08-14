import React, { useState } from 'react';
import { CaretLeft, CaretRight, LockSimple } from '@phosphor-icons/react';
import { MarksMap, MarkStatus } from '../../types/attendance';
import { THEME_COLORS } from '../../constants/config';
import { TRACK_FROM, TERM_START } from '../../constants/calendar';
import { formatDateKey } from '../../utils/dateUtils';
import { getDayKind, getLecturesOnDate, getMark } from '../../utils/attendanceMath';
import { DayDetailSheet } from './DayDetailSheet';

interface CalendarViewProps {
  marks: MarksMap;
  nowIST: Date;
  onToggleMark: (dateKey: string, index: number, status: MarkStatus) => void;
  onSetDayMarks: (dateKey: string, status: MarkStatus | null) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  marks,
  nowIST,
  onToggleMark,
  onSetDayMarks
}) => {
  // Semester runs from July (6) to Dec (11) 2026. Default to current month or August (7)
  const currentMonthIdx = nowIST.getMonth();
  const initialMonth = currentMonthIdx >= 6 && currentMonthIdx <= 11 ? currentMonthIdx : 7;
  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);
  const [activeDateKey, setActiveDateKey] = useState<string | null>(null);

  const year = 2026;
  const firstDay = new Date(year, selectedMonth, 1);
  const monthName = firstDay.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  // Calculate leading blanks (Monday as first day of week: 0 for Mon, 6 for Sun)
  const leadingBlanks = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();

  const todayKey = formatDateKey(nowIST);

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const cells = [];
  // 1. Leading blank cells
  for (let i = 0; i < leadingBlanks; i++) {
    cells.push({ isBlank: true, key: `blank-${i}` });
  }

  // 2. Month day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const k = `${year}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const kind = getDayKind(k);
    const lectures = getLecturesOnDate(k);
    const dayMarks = marks[k] || {};

    const isToday = k === todayKey;
    const isBaseline = k >= TERM_START && k < TRACK_FROM && kind === 'teaching';
    const anyAbsent = Object.values(dayMarks).some((v) => v === 'a');
    const allPresent = lectures.length > 0 && lectures.every((_, idx) => dayMarks[idx] === 'p');

    let bg = 'rgba(233, 233, 237, 0.035)';
    let fg = 'var(--color-text)';
    let border = '1px solid transparent';

    if (kind === 'weekend') {
      bg = 'transparent';
      fg = 'var(--color-neutral-700)';
    } else if (kind === 'diwali' || kind === 'holiday') {
      bg = `color-mix(in srgb, ${THEME_COLORS.AMBER} 12%, transparent)`;
      fg = 'var(--color-neutral-400)';
    } else if (kind === 'midterm') {
      bg = 'rgba(233, 233, 237, 0.02)';
      fg = 'var(--color-neutral-700)';
    } else if (kind === 'pre' || kind === 'post') {
      bg = 'transparent';
      fg = 'var(--color-neutral-800)';
    } else if (isBaseline) {
      bg = 'rgba(145, 132, 217, 0.08)';
      fg = 'var(--color-accent-200)';
      border = '1px dashed rgba(145, 132, 217, 0.25)';
    }

    if (allPresent) {
      bg = `color-mix(in srgb, ${THEME_COLORS.GREEN_BRIGHT} 16%, transparent)`;
    }
    if (anyAbsent) {
      bg = `color-mix(in srgb, ${THEME_COLORS.RED} 16%, transparent)`;
    }
    if (isToday) {
      border = '1px solid var(--color-accent)';
    }

    const dots = isBaseline
      ? lectures.map(() => 'var(--color-accent-400)')
      : lectures.map((_, idx) => {
          const m = getMark(marks, k, idx);
          if (m === 'p') return THEME_COLORS.GREEN_BRIGHT;
          if (m === 'a') return THEME_COLORS.RED;
          if (m === 'c') return THEME_COLORS.AMBER;
          return 'rgba(233, 233, 237, 0.22)';
        });

    cells.push({
      isBlank: false,
      key: k,
      dayNumber: day,
      bg,
      fg,
      border,
      dots,
      kind,
      isBaseline
    });
  }

  let monthPresents = 0;
  let monthAbsents = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const k = `${year}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayMarks = marks[k] || {};
    const lecs = getLecturesOnDate(k);
    
    lecs.forEach((_, idx) => {
      const m = dayMarks[idx];
      if (m === 'p') monthPresents++;
      else if (m === 'a') monthAbsents++;
    });
  }

  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
      gap: 'clamp(14px, 2vw, 22px)',
      padding: 'clamp(14px, 2vw, 22px)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(233, 233, 237, 0.05)'
    }}>
      {/* Calendar Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, flex: 1, margin: 0 }}>
            {monthName}
          </h3>
          <button
            onClick={() => setSelectedMonth((m) => Math.max(6, m - 1))}
            disabled={selectedMonth <= 6}
            className="btn btn-secondary btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Previous month"
            aria-label="Previous month"
          >
            <CaretLeft size={15} />
          </button>
          <button
            onClick={() => setSelectedMonth((m) => Math.min(11, m + 1))}
            disabled={selectedMonth >= 11}
            className="btn btn-secondary btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Next month"
            aria-label="Next month"
          >
            <CaretRight size={15} />
          </button>
        </div>

        {/* Compact Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '4px'
        }}>
          {daysOfWeek.map((dayLabel, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '10px',
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                color: 'var(--color-neutral-600)',
                textAlign: 'center',
                paddingBottom: '2px',
                fontWeight: 600
              }}
            >
              {dayLabel}
            </span>
          ))}

          {cells.map((cell) => {
            if (cell.isBlank) {
              return (
                <div
                  key={cell.key}
                  style={{
                    height: '44px',
                    background: 'transparent'
                  }}
                />
              );
            }

            return (
              <button
                key={cell.key}
                onClick={() => setActiveDateKey(cell.key)}
                style={{
                  height: '44px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  padding: '2px',
                  cursor: 'pointer',
                  borderRadius: '7px',
                  border: cell.border,
                  background: cell.bg,
                  color: cell.fg,
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 500,
                  transition: 'all 0.12s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span>{cell.dayNumber}</span>
                  {cell.isBaseline && <LockSimple size={9} color="var(--color-accent-400)" />}
                </div>
                <div style={{ display: 'flex', gap: '2px', height: '4px', alignItems: 'center' }}>
                  {cell.dots?.map((dotColor, dIdx) => (
                    <span
                      key={dIdx}
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: dotColor
                      }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Minimalist Month Snapshot */}
        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-neutral-400)',
          marginTop: '8px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(233, 233, 237, 0.05)'
        }}>
          {monthName.split(' ')[0]} Snapshot: <span style={{ color: THEME_COLORS.GREEN_BRIGHT }}>{monthPresents} Attended</span> • <span style={{ color: THEME_COLORS.RED }}>{monthAbsents} Missed</span>
        </div>
      </div>

      <DayDetailSheet
        dateKey={activeDateKey}
        marks={marks}
        onClose={() => setActiveDateKey(null)}
        onToggleMark={onToggleMark}
        onSetDayMarks={onSetDayMarks}
      />
    </section>
  );
};
