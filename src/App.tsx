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
import { SubjectExposure } from './components/subjects/SubjectExposure';
import { WeeklyTrendChart } from './components/trend/WeeklyTrendChart';
import { CloudSyncCard } from './components/setup/CloudSyncCard';
import { CalculationFacts } from './components/setup/CalculationFacts';
import { TargetSettings } from './components/setup/TargetSettings';
import { BackupRestore } from './components/setup/BackupRestore';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('calendar');
  const { nowIST, greeting, istClockFormatted, istDateFormatted, liveStatus } = useISTClock();

  const {
    marks,
    targetPercent,
    setTargetPercent,
    reserveDays,
    setReserveDays,
    stats,
    subjects,
    trends,
    toggleMark,
    setDayMarks,
    clearAllMarks,
    exportBackup,
    importBackup,
    firebase
  } = useAttendance(nowIST);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(120% 80% at 88% -10%, #22203c 0%, #161826 55%)',
      color: 'var(--color-text)',
      fontFamily: 'var(--font-body)',
      padding: 'clamp(14px, 3vw, 34px) clamp(12px, 3vw, 34px) calc(84px + env(safe-area-inset-bottom))'
    }}>
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


        {/* Active Tab View */}
        {activeTab === 'calendar' && (
          <CalendarView
            marks={marks}
            nowIST={nowIST}
            onToggleMark={toggleMark}
            onSetDayMarks={setDayMarks}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectExposure
            subjects={subjects}
            targetPercent={targetPercent}
            overallLeft={stats.left}
            subjectSafeSum={stats.subjectSafeSum}
            subjectLeftSum={stats.subjectLeftSum}
          />
        )}

        {activeTab === 'trend' && (
          <WeeklyTrendChart
            trends={trends}
            targetPercent={targetPercent}
          />
        )}

        {activeTab === 'setup' && (
          <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '14px'
          }}>
            <TargetSettings
              targetPercent={targetPercent}
              onTargetChange={setTargetPercent}
              reserveDays={reserveDays}
              onReserveDaysChange={setReserveDays}
            />
            <CloudSyncCard firebase={firebase} />
            <CalculationFacts
              stats={stats}
              targetPercent={targetPercent}
              onClearAll={clearAllMarks}
            />
            <BackupRestore
              onExport={exportBackup}
              onImport={importBackup}
            />
          </section>
        )}
      </div>

      {/* Fixed Bottom Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};
