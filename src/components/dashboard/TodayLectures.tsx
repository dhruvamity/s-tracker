import React from 'react';
import { Check, X, Minus } from '@phosphor-icons/react';
import { MarksMap, MarkStatus, TabId } from '../../types/attendance';
import { THEME_COLORS } from '../../constants/config';
import { TRACK_FROM, HOLIDAYS } from '../../constants/calendar';
import { formatDateKey, formatTimeRange } from '../../utils/dateUtils';
import { getDayKind, getLecturesOnDate, getMark } from '../../utils/attendanceMath';

interface TodayLecturesProps {
  marks: MarksMap;
  nowIST: Date;
  pastUnmarkedCount: number;
  onToggleMark: (dateKey: string, index: number, status: MarkStatus) => void;
  onNavigateTab: (tab: TabId) => void;
}

export const TodayLectures: React.FC<TodayLecturesProps> = ({
  marks,
  nowIST,
  pastUnmarkedCount,
  onToggleMark,
  onNavigateTab
}) => {
  const todayKey = formatDateKey(nowIST);
  const isEditable = todayKey >= TRACK_FROM;
  const kind = getDayKind(todayKey);
  const lectures = getLecturesOnDate(todayKey);

  let dayNote = '';
  if (isEditable) {
    if (kind === 'teaching') {
      dayNote = lectures.length === 2
        ? '2 lectures scheduled today'
        : '1 lecture scheduled today';
    } else if (kind === 'diwali') {
      dayNote = 'Diwali break';
    } else if (kind === 'midterm') {
      dayNote = 'Mid-term window';
    } else if (kind === 'holiday') {
      dayNote = HOLIDAYS[todayKey] || 'Holiday';
    } else {
      dayNote = 'Weekend';
    }
  }

  const emptyLabel = kind === 'weekend'
    ? 'No classes today.'
    : kind === 'diwali'
    ? 'Diwali break.'
    : kind === 'midterm'
    ? 'Mid-term exam window.'
    : kind === 'holiday'
    ? `${HOLIDAYS[todayKey] || 'Holiday'}.`
    : 'Nothing scheduled.';

  const getButtonStyle = (isActive: boolean, activeColor: string) => {
    return isActive
      ? {
          border: `1px solid ${activeColor}`,
          background: `color-mix(in srgb, ${activeColor} 22%, transparent)`,
          color: activeColor
        }
      : {
          border: '1px solid var(--color-divider)',
          background: 'transparent',
          color: 'var(--color-neutral-600)'
        };
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px' }}>
        <h2 style={{ fontSize: '19px', fontWeight: 600 }}>
          {isEditable && kind === 'teaching' ? "Today's lectures" : 'Today'}
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
          {dayNote}
        </span>

        {pastUnmarkedCount > 0 && (
          <button
            onClick={() => onNavigateTab('calendar')}
            className="btn btn-ghost"
            style={{ marginLeft: 'auto', fontSize: '12px', padding: '4px 8px' }}
          >
            {pastUnmarkedCount} past lecture{pastUnmarkedCount === 1 ? '' : 's'} still unmarked →
          </button>
        )}
      </div>

      {lectures.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '10px'
        }}>
          {lectures.map((lec, idx) => {
            const currentMark = getMark(marks, todayKey, idx);
            const accent = currentMark === 'p'
              ? THEME_COLORS.GREEN_BRIGHT
              : currentMark === 'a'
              ? THEME_COLORS.RED
              : currentMark === 'c'
              ? THEME_COLORS.AMBER
              : 'var(--color-neutral-800)';

            const shadow = currentMark
              ? `0 0 0 1px color-mix(in srgb, ${accent} 40%, transparent)`
              : 'var(--shadow-sm)';

            const pStyle = getButtonStyle(currentMark === 'p', THEME_COLORS.GREEN_BRIGHT);
            const aStyle = getButtonStyle(currentMark === 'a', THEME_COLORS.RED);
            const cStyle = getButtonStyle(currentMark === 'c', THEME_COLORS.AMBER);

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '13px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  boxShadow: shadow,
                  border: '1px solid rgba(233, 233, 237, 0.04)',
                  minWidth: 0,
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                <span style={{
                  width: '3px',
                  alignSelf: 'stretch',
                  borderRadius: '999px',
                  background: accent,
                  flex: 'none'
                }} />

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  minWidth: 0,
                  flex: 1
                }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '15px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {lec.s}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--color-neutral-500)',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {formatTimeRange(lec.t, lec.e)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '4px', flex: 'none' }}>
                  <button
                    onClick={() => isEditable && onToggleMark(todayKey, idx, 'p')}
                    disabled={!isEditable}
                    title="Mark Present"
                    style={{
                      width: '34px',
                      height: '34px',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '8px',
                      cursor: isEditable ? 'pointer' : 'not-allowed',
                      fontSize: '15px',
                      transition: 'all 0.15s ease',
                      ...pStyle
                    }}
                  >
                    <Check weight="bold" />
                  </button>

                  <button
                    onClick={() => isEditable && onToggleMark(todayKey, idx, 'a')}
                    disabled={!isEditable}
                    title="Mark Bunked / Absent"
                    style={{
                      width: '34px',
                      height: '34px',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '8px',
                      cursor: isEditable ? 'pointer' : 'not-allowed',
                      fontSize: '15px',
                      transition: 'all 0.15s ease',
                      ...aStyle
                    }}
                  >
                    <X weight="bold" />
                  </button>

                  <button
                    onClick={() => isEditable && onToggleMark(todayKey, idx, 'c')}
                    disabled={!isEditable}
                    title="Mark Class Cancelled"
                    style={{
                      width: '34px',
                      height: '34px',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '8px',
                      cursor: isEditable ? 'pointer' : 'not-allowed',
                      fontSize: '15px',
                      transition: 'all 0.15s ease',
                      ...cStyle
                    }}
                  >
                    <Minus weight="bold" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(233, 233, 237, 0.03)',
          boxShadow: 'var(--shadow-sm)',
          fontSize: '14px',
          color: 'var(--color-neutral-400)',
          border: '1px solid rgba(233, 233, 237, 0.04)'
        }}>
          {emptyLabel}
        </div>
      )}
    </section>
  );
};
