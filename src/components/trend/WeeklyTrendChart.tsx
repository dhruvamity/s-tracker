import React from 'react';
import { WeekTrend } from '../../types/attendance';

interface WeeklyTrendChartProps {
  trends: WeekTrend[];
  targetPercent: number;
}

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ trends, targetPercent }) => {
  const lineBottom = `${Math.round(targetPercent * 1.3) + 26}px`;

  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: 'clamp(14px, 2vw, 22px)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(233, 233, 237, 0.05)'
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
          Weekly trend
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
          Attendance per teaching week, against the {targetPercent}% target line.
        </span>
      </div>

      {trends.length > 0 ? (
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'clamp(6px, 1.6vw, 16px)',
          height: '200px',
          padding: '20px 0 0'
        }}>
          {/* Target guideline */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: lineBottom,
              height: '1px',
              background: 'linear-gradient(to right, transparent, var(--color-accent-700) 24px, var(--color-accent-700) calc(100% - 24px), transparent)',
              zIndex: 1
            }}
          >
            <span style={{
              position: 'absolute',
              right: '8px',
              bottom: '4px',
              fontSize: '10px',
              color: 'var(--color-accent-400)',
              fontWeight: 500
            }}>
              {targetPercent}% Target
            </span>
          </div>

          {trends.map((w) => (
            <div
              key={w.weekKey}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '7px',
                minWidth: 0,
                height: '100%',
                justifyContent: 'flex-end',
                zIndex: 2
              }}
            >
              <span style={{
                fontSize: '11px',
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--color-neutral-400)',
                fontWeight: 500
              }}>
                {w.pctLabel}
              </span>

              <div
                title={`${w.attended} of ${w.totalHeld} attended (${w.pctLabel})`}
                style={{
                  width: '100%',
                  maxWidth: '54px',
                  borderRadius: '6px 6px 2px 2px',
                  background: w.color,
                  height: `${w.heightPx}px`,
                  transition: 'height 0.4s ease, background 0.2s ease',
                  cursor: 'pointer'
                }}
              />

              <span style={{
                fontSize: '10px',
                color: 'var(--color-neutral-600)',
                whiteSpace: 'nowrap'
              }}>
                {w.label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-neutral-400)' }}>
          Mark a few lectures and your week-by-week trend appears here.
        </p>
      )}
    </section>
  );
};
