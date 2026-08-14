import React, { useState } from 'react';
import { TabId } from './types/attendance';
import { useISTClock } from './hooks/useISTClock';
import { useAttendance } from './hooks/useAttendance';
import { Header } from './components/layout/Header';
import { TabNavigation } from './components/layout/TabNavigation';
import { LiveStatusCard } from './components/dashboard/LiveStatusCard';
import { BunkBudgetRing } from './components/dashboard/BunkBudgetRing';
import { QuickStatsCard } from './components/dashboard/QuickStatsCard';
import { TodayLectures } from './components/dashboard/TodayLectures';
import { CalendarView } from './components/calendar/CalendarView';
import { WeeklyTrendChart } from './components/trend/WeeklyTrendChart';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('calendar');
  const { nowIST, greeting, istClockFormatted, istDateFormatted, liveStatus } = useISTClock();

  const {
    marks,
    targetPercent,
    reserveDays,
    stats,
    trends,
    toggleMark,
    setDayMarks
  } = useAttendance(nowIST);

  return (
    <div className="app-wrapper">
      <div style={{
        maxWidth: '1180px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(14px, 2vw, 22px)'
      }}>
        {/* Header */}
        <Header
          greeting={greeting}
          istClock={istClockFormatted}
          istDate={istDateFormatted}
        />

        {/* Overview Metric Cards */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(272px, 1fr))',
          gap: 'clamp(10px, 1.6vw, 16px)'
        }}>
          <LiveStatusCard live={liveStatus} />
          <BunkBudgetRing
            left={stats.left}
            allowed={stats.allowed}
            reserveDays={reserveDays}
          />
          <QuickStatsCard
            stats={stats}
            targetPercent={targetPercent}
            nowIST={nowIST}
          />
        </section>

        {/* Today's Lectures Quick Action Card */}
        <TodayLectures
          marks={marks}
          nowIST={nowIST}
          pastUnmarkedCount={stats.pastUnmarked}
          onToggleMark={toggleMark}
          onNavigateTab={setActiveTab}
        />

        {/* Responsive Tab Navigation (Inline on Desktop, Fixed Bottom on Mobile) */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Active Tab View */}
        {activeTab === 'calendar' && (
          <CalendarView
            marks={marks}
            nowIST={nowIST}
            onToggleMark={toggleMark}
            onSetDayMarks={setDayMarks}
          />
        )}

        {activeTab === 'trend' && (
          <WeeklyTrendChart
            trends={trends}
            targetPercent={targetPercent}
          />
        )}
      </div>
    </div>
  );
};
