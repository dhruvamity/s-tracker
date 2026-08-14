import React, { useState } from 'react';
import { CloudCheck, CaretDown, CaretUp } from '@phosphor-icons/react';
import { FirebaseSyncState } from '../../types/attendance';
import { THEME_COLORS } from '../../constants/config';

interface CloudSyncCardProps {
  firebase: {
    text: string;
    setText: (text: string) => void;
    status: FirebaseSyncState;
    message: string;
    connect: (config: string) => void;
    disconnect: () => void;
  };
}

export const CloudSyncCard: React.FC<CloudSyncCardProps> = ({ firebase }) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [customConfig, setCustomConfig] = useState<string>(firebase.text);

  const isConnected = firebase.status === 'live';
  const dotColor = isConnected
    ? THEME_COLORS.GREEN_BRIGHT
    : firebase.status === 'error'
    ? THEME_COLORS.RED
    : firebase.status === 'connecting'
    ? THEME_COLORS.AMBER
    : 'var(--color-neutral-600)';

  const statusLabel = isConnected
    ? 'Cloud Sync Active (Real-time sync enabled)'
    : firebase.status === 'connecting'
    ? 'Connecting to Cloud…'
    : firebase.status === 'error'
    ? (firebase.message || 'Sync error')
    : 'Local Storage Mode (Saved on this device)';

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CloudCheck size={22} color="var(--color-accent)" />
          <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
            Device &amp; Cloud Sync
          </h3>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-neutral-400)', lineHeight: 1.5 }}>
        All your attendance marks and preferences are automatically saved on this device. When cloud sync is connected, your marks follow you seamlessly across your phone, tablet, and laptop.
      </p>

      {/* Friendly Status Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        background: isConnected ? 'rgba(145, 132, 217, 0.08)' : 'rgba(233, 233, 237, 0.03)',
        border: '1px solid ' + (isConnected ? 'rgba(145, 132, 217, 0.2)' : 'rgba(233, 233, 237, 0.05)')
      }}>
        <span style={{
          width: '9px',
          height: '9px',
          borderRadius: '50%',
          background: dotColor,
          boxShadow: isConnected ? `0 0 8px ${dotColor}` : 'none'
        }} />
        <span style={{
          fontSize: '13px',
          color: isConnected ? 'var(--color-accent-100)' : 'var(--color-neutral-300)',
          fontWeight: 500
        }}>
          {statusLabel}
        </span>
      </div>

      {/* Advanced Developer Settings Collapsible */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        paddingTop: '6px'
      }}>
        <button
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="btn btn-ghost"
          style={{
            alignSelf: 'flex-start',
            fontSize: '12px',
            color: 'var(--color-neutral-500)',
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          {showAdvanced ? <CaretUp size={12} /> : <CaretDown size={12} />}
          <span>{showAdvanced ? 'Hide Advanced Cloud Settings' : 'Advanced Cloud Settings (Custom Server)'}</span>
        </button>

        {showAdvanced && (
          <div className="animate-fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--color-divider)',
            marginTop: '4px'
          }}>
            <div className="field">
              <label htmlFor="fbcfg" style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>
                Custom Firebase Web Configuration (JSON)
              </label>
              <textarea
                id="fbcfg"
                className="input"
                spellCheck={false}
                placeholder='{ "apiKey": "…", "authDomain": "…", "projectId": "…" }'
                value={customConfig}
                onChange={(e) => {
                  setCustomConfig(e.target.value);
                  firebase.setText(e.target.value);
                }}
                style={{
                  minHeight: '80px',
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '11px',
                  lineHeight: 1.4
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => firebase.connect(customConfig)}
                className="btn btn-primary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Apply Custom Config
              </button>
              {isConnected && (
                <button
                  onClick={() => {
                    firebase.disconnect();
                    setCustomConfig('');
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
