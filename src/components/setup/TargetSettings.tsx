import React from 'react';
import { Sliders } from '@phosphor-icons/react';

interface TargetSettingsProps {
  targetPercent: number;
  onTargetChange: (target: number) => void;
  reserveDays: number;
  onReserveDaysChange: (reserve: number) => void;
}

export const TargetSettings: React.FC<TargetSettingsProps> = ({
  targetPercent,
  onTargetChange,
  reserveDays,
  onReserveDaysChange
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      padding: 'clamp(14px, 2vw, 22px)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(233, 233, 237, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sliders size={20} color="var(--color-accent)" />
        <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
          Rules &amp; Target Settings
        </h3>
      </div>
      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-neutral-400)' }}>
        Customize your target attendance threshold and safety reserve buffer for emergency illness days.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
        <div className="field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label htmlFor="target-slider">Target Attendance Requirement</label>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              color: 'var(--color-accent)',
              fontSize: '15px'
            }}>
              {targetPercent}%
            </span>
          </div>
          <input
            id="target-slider"
            type="range"
            min={60}
            max={90}
            step={1}
            value={targetPercent}
            onChange={(e) => onTargetChange(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--color-accent)',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-neutral-600)' }}>
            <span>60% (Minimum)</span>
            <span>75% (Standard)</span>
            <span>90% (Distinction)</span>
          </div>
        </div>

        <div className="field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label htmlFor="reserve-input">Reserve Buffer (Buffer for Illness / Emergencies)</label>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              color: 'var(--color-accent)',
              fontSize: '15px'
            }}>
              {reserveDays} days
            </span>
          </div>
          <input
            id="reserve-input"
            type="range"
            min={0}
            max={15}
            step={1}
            value={reserveDays}
            onChange={(e) => onReserveDaysChange(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--color-accent)',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
    </div>
  );
};
