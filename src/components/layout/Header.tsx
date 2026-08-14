import React from 'react';
import { Clock } from '@phosphor-icons/react';

interface HeaderProps {
  greeting: string;
  istClock: string;
  istDate: string;
}

export const Header: React.FC<HeaderProps> = ({ greeting, istClock, istDate }) => {
  return (
    <header style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      <h1 style={{
        fontSize: 'clamp(26px, 5vw, 36px)',
        letterSpacing: '-0.02em',
        fontWeight: 'var(--font-heading-weight)',
        margin: 0
      }}>
        {greeting}, Saanvi
      </h1>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '7px 14px',
        borderRadius: '999px',
        background: 'rgba(233, 233, 237, 0.05)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid rgba(233, 233, 237, 0.08)'
      }}>
        <Clock size={16} weight="regular" color="var(--color-accent)" />
        <span style={{
          fontVariantNumeric: 'tabular-nums',
          fontSize: '14px',
          fontWeight: 500
        }}>
          {istClock}
        </span>
        <span style={{
          width: '1px',
          height: '14px',
          background: 'var(--color-divider)'
        }} />
        <span style={{
          fontSize: '13px',
          color: 'var(--color-neutral-500)'
        }}>
          {istDate}
        </span>
      </div>
    </header>
  );
};
