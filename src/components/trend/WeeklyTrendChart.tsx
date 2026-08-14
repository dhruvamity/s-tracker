import React, { useState } from 'react';
import { WeekTrend } from '../../types/attendance';
import { THEME_COLORS } from '../../constants/config';
import { Info } from '@phosphor-icons/react';

interface WeeklyTrendChartProps {
  trends: WeekTrend[];
  targetPercent: number;
}

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ trends, targetPercent }) => {
  const [hoveredWeek, setHoveredWeek] = useState<WeekTrend | null>(null);
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
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
            Weekly Attendance Trend
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>
            Attendance percentage per teaching week against the {targetPercent}% target requirement.
          </span>
        </div>

        {hoveredWeek && (
          <div style={{
            fontSize: '12px',
            color: 'var(--color-accent-200)',
            background: 'rgba(145, 132, 217, 0.12)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(145, 132, 217, 0.2)'
          }}>
            Week of {hoveredWeek.label}: <strong>{hoveredWeek.attended} / {hoveredWeek.totalHeld} attended ({hoveredWeek.pctLabel})</strong>
            {hoveredWeek.isBaseline && ' · Historical Baseline'}
          </div>
        )}
      </div>

      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 'clamp(8px, 2vw, 20px)',
        height: '210px',
        padding: '24px 0 10px',
        borderBottom: '1px solid var(--color-divider)'
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
            borderTop: '1px dashed var(--color-accent-500)',
            zIndex: 1
          }}
        >
          <span style={{
            position: 'absolute',
            right: '8px',
            bottom: '4px',
            fontSize: '10px',
            color: 'var(--color-accent-300)',
            fontWeight: 600,
            background: 'var(--color-surface)',
            padding: '0 4px',
            borderRadius: '3px'
          }}>
            {targetPercent}% Target Line
          </span>
        </div>

        {trends.map((w) => (
          <div
            key={w.weekKey}
            onMouseEnter={() => setHoveredWeek(w)}
            onMouseLeave={() => setHoveredWeek(null)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              minWidth: 0,
              height: '100%',
              justifyContent: 'flex-end',
              zIndex: 2,
              cursor: 'pointer'
            }}
          >
            <span style={{
              fontSize: '11px',
              fontVariantNumeric: 'tabular-nums',
              color: w.pct >= targetPercent ? 'var(--color-text)' : THEME_COLORS.AMBER,
              fontWeight: 600
            }}>
              {w.pctLabel}
            </span>

            <div
              title={`${w.attended} of ${w.totalHeld} attended (${w.pctLabel})${w.isBaseline ? ' · Baseline' : ''}`}
              style={{
                width: '100%',
                maxWidth: '54px',
                borderRadius: '6px 6px 2px 2px',
                background: w.isBaseline
                  ? 'linear-gradient(to top, #4c4672, #7a70b0)'
                  : w.color,
                height: `${w.heightPx}px`,
                transition: 'all 0.3s ease',
                border: w.isBaseline ? '1px solid rgba(145, 132, 217, 0.3)' : 'none',
                opacity: hoveredWeek && hoveredWeek.weekKey !== w.weekKey ? 0.6 : 1
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{
                fontSize: '11px',
                color: 'var(--color-neutral-400)',
                whiteSpace: 'nowrap',
                fontWeight: 500
              }}>
                {w.label}
              </span>
              {w.isBaseline && (
                <span style={{
                  fontSize: '8px',
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  color: 'var(--color-neutral-500)',
                  fontWeight: 600
                }}>
                  Past
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        color: 'var(--color-neutral-500)',
        paddingTop: '2px'
      }}>
        <Info size={14} color="var(--color-accent)" style={{ flex: 'none' }} />
        <span>
          Weeks marked "Past" represent historical pre-loaded baseline data (27 attended of 33 held across July 20 – Aug 14).
        </span>
      </div>
    </section>
  );
};
