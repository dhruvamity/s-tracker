import React from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import { SubjectStat } from '../../types/attendance';

interface SubjectExposureProps {
  subjects: SubjectStat[];
  targetPercent: number;
  overallLeft?: number;
  subjectSafeSum?: number;
  subjectLeftSum?: number;
}

export const SubjectExposure: React.FC<SubjectExposureProps> = ({
  subjects,
  targetPercent,
  overallLeft = 20,
  subjectSafeSum = 15,
  subjectLeftSum = 15
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
        <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
          Subject Breakdown &amp; Safe Bunks
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)', textWrap: 'pretty' }}>
          Remaining sessions per course and maximum safe absences allowed while maintaining {targetPercent}% per paper.
        </span>
      </div>

      {/* Critical Mathematical Explanation & Debarment Warning Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(145, 132, 217, 0.08)',
        border: '1px solid rgba(145, 132, 217, 0.22)',
        color: 'var(--color-text)'
      }}>
        <WarningCircle size={20} color="var(--color-accent-300)" style={{ flex: 'none', marginTop: '2px' }} weight="fill" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px', lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600, color: 'var(--color-accent-200)' }}>
            Per-Subject Ceiling vs. Overall Semester Budget
          </span>
          <span style={{ color: 'var(--color-neutral-300)' }}>
            While your overall semester allows <strong>{overallLeft} total bunks</strong>, each subject enforces its own independent {targetPercent}% requirement (summing to <strong>{subjectLeftSum} safe bunks</strong> remaining out of {subjectSafeSum} total course allowances). Do not exceed a subject's individual safe ceiling to avoid course debarment.
          </span>
        </div>
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
              gap: '8px',
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

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '26px',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 600,
                color: subj.color
              }}>
                {subj.left}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>
                {subj.left === 1 ? 'safe bunk remaining' : 'safe bunks remaining'}
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

            <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textWrap: 'pretty' }}>
              {subj.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
