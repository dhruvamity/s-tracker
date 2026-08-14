import React from 'react';
import { CalendarDots, Books, ChartBar, GearSix } from '@phosphor-icons/react';
import { TabId } from '../../types/attendance';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'calendar', label: 'Calendar', icon: <CalendarDots size={16} /> },
    { id: 'subjects', label: 'Subjects', icon: <Books size={16} /> },
    { id: 'trend', label: 'Trend', icon: <ChartBar size={16} /> },
    { id: 'setup', label: 'Setup', icon: <GearSix size={16} /> }
  ];

  return (
    <nav style={{
      display: 'flex',
      gap: '4px',
      flexWrap: 'wrap',
      padding: '4px',
      borderRadius: '12px',
      background: 'rgba(233, 233, 237, 0.04)',
      alignSelf: 'flex-start',
      maxWidth: '100%',
      border: '1px solid rgba(233, 233, 237, 0.06)'
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 14px',
              borderRadius: '9px',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              fontWeight: 500,
              border: '1px solid ' + (isActive ? 'var(--color-accent-700)' : 'transparent'),
              background: isActive ? 'color-mix(in srgb, var(--color-accent) 16%, transparent)' : 'transparent',
              color: isActive ? 'var(--color-accent-200)' : 'var(--color-neutral-400)',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};
