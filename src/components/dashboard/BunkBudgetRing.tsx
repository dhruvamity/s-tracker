import React from 'react';
import { THEME_COLORS } from '../../constants/config';
import { Info } from '@phosphor-icons/react';

interface BunkBudgetRingProps {
  left: number;
  allowed: number;
  absent: number;
  reserveDays: number;
  targetPercent: number;
  subjectSafeSum?: number;
  subjectLeftSum?: number;
}

export const BunkBudgetRing: React.FC<BunkBudgetRingProps> = ({
  left,
  allowed,
  absent,
  reserveDays,
  targetPercent,
  subjectLeftSum = 15
}) => {
  const safeLeft = Math.max(0, left);
  const color = left <= 0
    ? THEME_COLORS.RED
    : left <= reserveDays
    ? THEME_COLORS.AMBER
    : THEME_COLORS.GREEN_BRIGHT;

  const fraction = allowed > 0 ? Math.max(0, Math.min(1, safeLeft / allowed)) : 0;
  const circumference = 326.7;
  const strokeDashoffset = circumference - circumference * fraction;

  const note = left <= 0
    ? `Budget exhausted — every further absence drops overall attendance under ${targetPercent}%.`
    : `Reserve ~${reserveDays} bunks for emergencies. Tue & Wed: 2 slots/day; other days have 1 slot.`;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '18px',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(233, 233, 237, 0.05)',
      minWidth: 0,
      justifyContent: 'center'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        minWidth: 0
      }}>
        <div style={{ position: 'relative', flex: 'none', width: '104px', height: '104px' }}>
          <svg viewBox="0 0 120 120" style={{ width: '104px', height: '104px', transform: 'rotate(-90deg)' }}>
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgba(233, 233, 237, 0.08)"
              strokeWidth="9"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '30px',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
              color
            }}>
              {safeLeft}
            </span>
            <span style={{
              fontSize: '9px',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: 'var(--color-neutral-500)',
              marginTop: '2px'
            }}>
              left
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '10px',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              fontWeight: 600
            }}>
              Overall Bunk Budget
            </span>
          </div>
          <span style={{ fontSize: '14px', color: 'var(--color-neutral-200)', fontWeight: 500 }}>
            {absent} of {allowed} spent
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)', textWrap: 'pretty' }}>
            {note}
          </span>
        </div>
      </div>

      {/* Per-subject constraint helper note */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(233, 233, 237, 0.03)',
        border: '1px solid rgba(233, 233, 237, 0.06)',
        fontSize: '11px',
        color: 'var(--color-neutral-400)'
      }}>
        <Info size={14} color="var(--color-accent)" style={{ flex: 'none' }} />
        <span>
          <strong>Subject ceiling:</strong> Individual courses sum to {subjectLeftSum} safe bunks left (see Subjects tab).
        </span>
      </div>
    </div>
  );
};
