import React from 'react';
import { X, Check, Minus } from '@phosphor-icons/react';
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
    month: 'long'
  });

  const kindLabel = kind === 'teaching'
    ? isEditable
      ? `${lectures.length} lecture${lectures.length > 1 ? 's' : ''}`
      : 'Baseline period'
    : kind === 'diwali'
    ? 'Diwali break'
    : kind === 'midterm'
    ? 'Mid-term window'
    : kind === 'holiday'
    ? 'Holiday'
    : kind === 'weekend'
    ? 'Weekend'
    : 'Outside term';

  const kindColor = kind === 'teaching'
    ? 'var(--color-accent)'
    : kind === 'holiday' || kind === 'diwali'
    ? THEME_COLORS.AMBER
    : 'var(--color-neutral-500)';

  const reason = kind === 'holiday'
    ? `${HOLIDAYS[dateKey]} (Official Holiday)`
    : kind === 'diwali'
    ? 'Diwali break.'
    : kind === 'midterm'
    ? 'Mid-term exam window.'
    : kind === 'weekend'
    ? 'Weekend.'
    : !isEditable
    ? 'Records prior to 17 Aug are locked.'
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
          width: 'min(540px, 100%)',
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
              fontSize: '10px',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: kindColor,
              fontWeight: 600
            }}>
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

                    <div style={{ display: 'flex', gap: '4px', flex: 'none' }}>
                      <button
                        onClick={() => onToggleMark(dateKey, idx, 'p')}
                        title="Present"
                        style={{
                          width: '34px',
                          height: '34px',
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '15px',
                          ...pStyle
                        }}
                      >
                        <Check weight="bold" />
                      </button>

                      <button
                        onClick={() => onToggleMark(dateKey, idx, 'a')}
                        title="Bunked"
                        style={{
                          width: '34px',
                          height: '34px',
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '15px',
                          ...aStyle
                        }}
                      >
                        <X weight="bold" />
                      </button>

                      <button
                        onClick={() => onToggleMark(dateKey, idx, 'c')}
                        title="Class cancelled"
                        style={{
                          width: '34px',
                          height: '34px',
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '15px',
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
                color: 'var(--color-neutral-600)',
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
                All present
              </button>
              <button
                onClick={() => onSetDayMarks(dateKey, 'a')}
                className="btn btn-secondary"
                style={{ fontSize: '13px' }}
              >
                Bunked the day ({lectures.length} {lectures.length === 1 ? 'lecture' : 'lectures'})
              </button>
              <button
                onClick={() => onSetDayMarks(dateKey, null)}
                className="btn btn-ghost"
                style={{ fontSize: '13px' }}
              >
                Clear
              </button>
            </div>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-neutral-400)', textWrap: 'pretty' }}>
            {reason}
          </p>
        )}
      </div>
    </div>
  );
};
