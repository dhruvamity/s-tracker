import React from 'react';
import { CalendarDots, Books, ChartBar } from '@phosphor-icons/react';
import { TabId } from '../../types/attendance';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'calendar', label: 'Calendar', icon: <CalendarDots size={16} /> },
    { id: 'subjects', label: 'Subjects', icon: <Books size={16} /> },
    { id: 'trend', label: 'Trend', icon: <ChartBar size={16} /> }
  ];

  return (
    <nav className="responsive-tab-nav" aria-label="Main Navigation">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab-nav-btn ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="tab-nav-btn-icon-wrapper">
              {tab.icon}
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
