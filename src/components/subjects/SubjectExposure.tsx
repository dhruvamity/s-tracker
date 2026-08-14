import React from 'react';
import { SubjectStat } from '../../types/attendance';
import { Books } from '@phosphor-icons/react';

interface SubjectExposureProps {
  subjects: SubjectStat[];
  targetPercent: number;
}

export const SubjectExposure: React.FC<SubjectExposureProps> = ({
  subjects,
  targetPercent
}) => {
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
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Books size={20} color="var(--color-accent)" />
          Subject Breakdown
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>
          Individual course performance. (Overall {targetPercent}% aggregate requirement across all subjects combined).
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))',
        gap: '12px'
      }}>
        {subjects.map((subj) => (
          <div
            key={subj.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(233, 233, 237, 0.03)',
              boxShadow: subj.shadow,
              border: '1px solid rgba(233, 233, 237, 0.05)'
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

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '24px',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 600,
                color: subj.color
              }}>
                {subj.pctLabel}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)', fontVariantNumeric: 'tabular-nums' }}>
                {subj.attended} / {subj.attended + subj.absent} held
              </span>
            </div>

            <div style={{
              height: '5px',
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

            <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)' }}>
              {subj.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
