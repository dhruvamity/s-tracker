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
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px env(safe-area-inset-right) max(10px, env(safe-area-inset-bottom)) env(safe-area-inset-left)',
      background: 'rgba(22, 24, 38, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(233, 233, 237, 0.06)',
      zIndex: 50
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '6px',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
              fontSize: '11px',
              fontWeight: 500,
              border: 'none',
              background: 'transparent',
              color: isActive ? 'var(--color-accent-300)' : 'var(--color-neutral-500)',
              transition: 'all 0.15s ease',
              flex: 1
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '16px',
              background: isActive ? 'color-mix(in srgb, var(--color-accent) 16%, transparent)' : 'transparent',
              transition: 'all 0.15s ease'
            }}>
              {tab.icon}
            </div>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};
