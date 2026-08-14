import React from 'react';
import { X, Check, Prohibit, LockSimple } from '@phosphor-icons/react';
import { MarksMap, MarkStatus } from '../../types/attendance';
import { THEME_COLORS } from '../../constants/config';
import { TRACK_FROM, HOLIDAYS } from '../../constants/calendar';
import { parseDateKey, formatTimeRange } from '../../utils/dateUtils';
import { getDayKind, getLecturesOnDate, getMark } from '../../utils/attendanceMath';

interface DayDetailSheetProps {
  dateKey: string | null;
  marks: MarksMap;
  onClose: () => void;
  onToggleMark: (dateKey: string, index: number, status: MarkStatus) => void;
  onSetDayMarks: (dateKey: string, status: MarkStatus | null) => void;
}

export const DayDetailSheet: React.FC<DayDetailSheetProps> = ({
  dateKey,
  marks,
  onClose,
  onToggleMark,
  onSetDayMarks
}) => {
  if (!dateKey) return null;

  const date = parseDateKey(dateKey);
  const isEditable = dateKey >= TRACK_FROM;
  const kind = getDayKind(dateKey);
  const lectures = getLecturesOnDate(dateKey);
  const hasLectures = lectures.length > 0 && isEditable;

  const dateLabel = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const kindLabel = kind === 'teaching'
    ? isEditable
      ? `${lectures.length} lecture${lectures.length > 1 ? 's' : ''} scheduled`
      : 'Historical Baseline Period'
    : kind === 'diwali'
    ? 'Diwali break'
    : kind === 'midterm'
    ? 'Mid-term window'
    : kind === 'holiday'
    ? 'Official Holiday'
    : kind === 'weekend'
    ? 'Weekend'
    : 'Outside term';

  const kindColor = kind === 'teaching'
    ? isEditable ? 'var(--color-accent)' : 'var(--color-neutral-400)'
    : kind === 'holiday' || kind === 'diwali'
    ? THEME_COLORS.AMBER
    : 'var(--color-neutral-500)';

  const reason = kind === 'holiday'
    ? `${HOLIDAYS[dateKey]} — Official University Holiday.`
    : kind === 'diwali'
    ? 'Diwali break — no classes scheduled.'
    : kind === 'midterm'
    ? 'Mid-term exam window.'
    : kind === 'weekend'
    ? 'Weekend Safe Zone.'
    : !isEditable
    ? 'Pre-loaded Historical Baseline (27 attended of 33 held across July 20 – Aug 14). Daily in-app marks activate from 17 Aug.'
    : 'No classes scheduled on this day.';

  const getButtonStyle = (isActive: boolean, activeColor: string) => {
    return isActive
      ? {
          border: `1px solid ${activeColor}`,
          background: `color-mix(in srgb, ${activeColor} 22%, transparent)`,
          color: activeColor,
          boxShadow: `0 0 8px color-mix(in srgb, ${activeColor} 40%, transparent)`
        }
      : {
          border: '1px solid var(--color-divider)',
          background: 'rgba(233, 233, 237, 0.02)',
          color: 'var(--color-neutral-400)'
        };
  };

  return (
    <div
      onClick={onClose}
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(11, 12, 20, 0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-up"
        style={{
          width: 'min(560px, 100%)',
          maxHeight: '86vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '24px',
          borderRadius: '20px 20px 0 0',
          background: '#1d1f2c',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(233, 233, 237, 0.1)',
          borderBottom: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
            <span style={{
              fontSize: '11px',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: kindColor,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              {!isEditable && kind === 'teaching' && <LockSimple size={13} />}
              {kindLabel}
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 600 }}>
              {dateLabel}
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: '32px', height: '32px' }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {hasLectures ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lectures.map((lec, idx) => {
                const currentMark = getMark(marks, dateKey, idx);
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
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(233, 233, 237, 0.04)',
                      border: '1px solid rgba(233, 233, 237, 0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 500 }}>
                        {lec.s}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)', fontVariantNumeric: 'tabular-nums' }}>
                        {formatTimeRange(lec.t, lec.e)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flex: 'none', alignItems: 'center' }}>
                      <button
                        onClick={() => onToggleMark(dateKey, idx, 'p')}
                        title="Mark Present (Attended)"
                        aria-label="Mark Present"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 9px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 500,
                          transition: 'all 0.15s ease',
                          ...pStyle
                        }}
                      >
                        <Check weight="bold" size={14} />
                        <span>Attended</span>
                      </button>

                      <button
                        onClick={() => onToggleMark(dateKey, idx, 'a')}
                        title="Mark Absent (Missed)"
                        aria-label="Mark Absent"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 9px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 500,
                          transition: 'all 0.15s ease',
                          ...aStyle
                        }}
                      >
                        <X weight="bold" size={14} />
                        <span>Missed</span>
                      </button>

                      <button
                        onClick={() => onToggleMark(dateKey, idx, 'c')}
                        title="Mark Cancelled / No Class"
                        aria-label="Mark Cancelled"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 8px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 500,
                          transition: 'all 0.15s ease',
                          ...cStyle
                        }}
                      >
                        <Prohibit weight="bold" size={14} />
                        <span>Off</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px',
              paddingTop: '14px',
              borderTop: '1px solid var(--color-divider)'
            }}>
              <span style={{
                width: '100%',
                fontSize: '11px',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: 'var(--color-neutral-500)',
                fontWeight: 600,
                marginBottom: '2px'
              }}>
                Whole day batch actions
              </span>
              <button
                onClick={() => onSetDayMarks(dateKey, 'p')}
                className="btn btn-primary"
                style={{ fontSize: '13px' }}
              >
                Mark All Attended
              </button>
              <button
                onClick={() => onSetDayMarks(dateKey, 'a')}
                className="btn btn-secondary"
                style={{ fontSize: '13px' }}
              >
                Missed Full Day ({lectures.length} {lectures.length === 1 ? 'lecture' : 'lectures'})
              </button>
              <button
                onClick={() => onSetDayMarks(dateKey, null)}
                className="btn btn-ghost"
                style={{ fontSize: '13px' }}
              >
                Reset Day
              </button>
            </div>
          </>
        ) : (
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(233, 233, 237, 0.03)',
            border: '1px solid rgba(233, 233, 237, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-neutral-300)', lineHeight: 1.5 }}>
              {reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
