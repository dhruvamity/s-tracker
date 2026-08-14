import React from 'react';
import { SubjectStat } from '../../types/attendance';

interface SubjectExposureProps {
  subjects: SubjectStat[];
  targetPercent: number;
}

export const SubjectExposure: React.FC<SubjectExposureProps> = ({ subjects, targetPercent }) => {
  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      padding: 'clamp(14px, 2vw, 22px)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(233, 233, 237, 0.05)'
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
          Subject exposure
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)', textWrap: 'pretty' }}>
          Sessions left this term, and how many of them you can drop at {targetPercent}% per paper.
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))',
        gap: '10px'
      }}>
        {subjects.map((subj) => (
          <div
            key={subj.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(233, 233, 237, 0.03)',
              boxShadow: subj.shadow,
              border: '1px solid rgba(233, 233, 237, 0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600, flex: 1 }}>
                {subj.name}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>
                {subj.days}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '24px',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 600,
                color: subj.color
              }}>
                {subj.left}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                {subj.left === 1 ? 'safe bunk left' : 'safe bunks left'}
              </span>
            </div>

            <div style={{
              height: '4px',
              borderRadius: '999px',
              background: 'rgba(233, 233, 237, 0.08)',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                borderRadius: '999px',
                background: subj.color,
                width: subj.barPct,
                transition: 'width 0.4s ease'
              }} />
            </div>

            <span style={{ fontSize: '11px', color: 'var(--color-neutral-500)', textWrap: 'pretty' }}>
              {subj.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
