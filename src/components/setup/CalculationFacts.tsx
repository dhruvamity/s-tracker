import React from 'react';
import { AttendanceStats } from '../../types/attendance';
import { BASE_ATT, BASE_HELD } from '../../constants/config';

interface CalculationFactsProps {
  stats: AttendanceStats;
  targetPercent: number;
  onClearAll: () => void;
}

export const CalculationFacts: React.FC<CalculationFactsProps> = ({
  stats,
  targetPercent,
  onClearAll
}) => {
  const mustAttend = Math.max(0, Math.ceil((stats.H * targetPercent) / 100 - BASE_ATT));

  const facts = [
    { k: 'Frozen baseline to 14 Aug', v: `${BASE_ATT} / ${BASE_HELD}` },
    { k: 'Lectures scheduled 17 Aug – 1 Dec', v: String(stats.R) },
    { k: 'Semester total once held', v: String(stats.H) },
    { k: 'Must attend from here', v: `${mustAttend} of ${stats.R}` },
    { k: `Bunk budget at ${targetPercent}%`, v: String(stats.allowed) },
    { k: 'Slots removed by holidays and Diwali', v: '22' },
    { k: 'Classes cancelled by you', v: String(stats.cancelled) }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      padding: 'clamp(14px, 2vw, 22px)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(233, 233, 237, 0.05)'
    }}>
      <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
        The numbers behind this
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {facts.map((fact, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '10px',
              fontSize: '13px'
            }}
          >
            <span style={{ color: 'var(--color-neutral-500)', flex: 1, textWrap: 'pretty' }}>
              {fact.k}
            </span>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
              fontWeight: 500
            }}>
              {fact.v}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (window.confirm('Clear every attendance mark you have recorded?')) {
            onClearAll();
          }
        }}
        className="btn btn-secondary"
        style={{ alignSelf: 'flex-start', marginTop: '6px', fontSize: '13px' }}
      >
        Clear every mark
      </button>
    </div>
  );
};
