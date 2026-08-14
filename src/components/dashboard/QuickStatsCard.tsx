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
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '18px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-surface)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid rgba(233, 233, 237, 0.05)',
          alignContent: 'center',
          minWidth: 0
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-200)', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-neutral-500)', width: '90px' }}>NOW</span>
            {stats.currentPct.toFixed(1)}% <span style={{ color: 'var(--color-neutral-500)', marginLeft: '6px' }}>({stats.attNow}/{stats.heldNow})</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-200)', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-neutral-500)', width: '90px' }}>PROJECTED</span>
            <span style={{ color: projColor }}>{stats.projected.toFixed(1)}%</span>
          </div>
          
          <div style={{
            marginTop: '8px',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-divider)',
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px'
          }}>
            <FlagCheckered size={15} color="var(--color-accent)" weight="bold" />
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '15px',
              fontWeight: 600
            }}>
              {daysLeft} days left
            </span>
          </div>
        </div>
  );
};
