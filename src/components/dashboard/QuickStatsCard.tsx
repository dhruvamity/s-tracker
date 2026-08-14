import React from 'react';
import { FlagCheckered } from '@phosphor-icons/react';
import { AttendanceStats } from '../../types/attendance';
import { THEME_COLORS } from '../../constants/config';
import { parseDateKey, formatDateKey } from '../../utils/dateUtils';
import { TERM_END } from '../../constants/calendar';

interface QuickStatsCardProps {
  stats: AttendanceStats;
  targetPercent: number;
  nowIST: Date;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ stats, targetPercent, nowIST }) => {
  const todayKey = formatDateKey(nowIST);
  const lastDay = parseDateKey(TERM_END);
  const daysLeft = Math.max(0, Math.ceil((lastDay.getTime() - parseDateKey(todayKey).getTime()) / 86400000));

  const projColor = stats.projected >= targetPercent ? 'var(--color-text)' : THEME_COLORS.RED;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2px 14px',
      padding: '18px',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(233, 233, 237, 0.05)',
      alignContent: 'center',
      minWidth: 0
    }}>
      <span style={{
        fontSize: '10px',
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: 'var(--color-neutral-500)',
        fontWeight: 600
      }}>
        Now
      </span>
      <span style={{
        fontSize: '10px',
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: 'var(--color-neutral-500)',
        fontWeight: 600
      }}>
        Projected
      </span>

      <span style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(22px, 3.6vw, 28px)',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.2,
        fontWeight: 600
      }}>
        {stats.currentPct.toFixed(2)}%
      </span>
      <span style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(22px, 3.6vw, 28px)',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.2,
        fontWeight: 600,
        color: projColor
      }}>
        {stats.projected.toFixed(2)}%
      </span>

      <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)', fontWeight: 500 }}>
        {stats.attNow} / {stats.heldNow} attended
      </span>
      <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
        if all future classes attended
      </span>

      <div style={{
        gridColumn: 'span 2',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid var(--color-divider)',
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px'
      }}>
        <FlagCheckered size={15} color="var(--color-accent)" weight="bold" />
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '19px',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600
        }}>
          {daysLeft}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
          days until 1 Dec (teaching ends)
        </span>
      </div>
    </div>
  );
};
