import React from 'react';
import { LiveLectureStatus } from '../../types/attendance';

interface LiveStatusCardProps {
  live: LiveLectureStatus;
}

export const LiveStatusCard: React.FC<LiveStatusCardProps> = ({ live }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '18px',
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(150deg, #2a2745, #20222f 60%)',
      boxShadow: 'var(--shadow-md)',
      minWidth: 0,
      border: '1px solid rgba(233, 233, 237, 0.07)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          className={live.isLive ? 'animate-pulse-dot' : ''}
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: live.dot
          }}
        />
        <span style={{
          fontSize: '10px',
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: 'var(--color-accent-300)',
          fontWeight: 600
        }}>
          {live.kicker}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(20px, 3.4vw, 27px)',
          lineHeight: 1.1,
          fontWeight: 'var(--font-heading-weight)'
        }}>
          {live.subject}
        </span>
        <span style={{
          fontSize: '14px',
          color: 'var(--color-neutral-400)',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {live.timeRange}
        </span>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <div style={{
          height: '4px',
          borderRadius: '999px',
          background: 'rgba(233, 233, 237, 0.09)',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            borderRadius: '999px',
            background: 'var(--color-accent)',
            width: live.progress,
            transition: 'width 0.5s ease'
          }} />
        </div>
        <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
          {live.meta}
        </span>
      </div>
    </div>
  );
};
