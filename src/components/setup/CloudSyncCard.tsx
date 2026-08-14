import React, { useState } from 'react';
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
  const [localText, setLocalText] = useState<string>(firebase.text);

  const dotColor = firebase.status === 'live'
    ? THEME_COLORS.GREEN_BRIGHT
    : firebase.status === 'error'
    ? THEME_COLORS.RED
    : firebase.status === 'connecting'
    ? THEME_COLORS.AMBER
    : 'var(--color-neutral-600)';

  const statusLabel = firebase.message || (
    firebase.status === 'live' ? 'Synced' : 'Saving on this device only'
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: 'clamp(14px, 2vw, 22px)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(233, 233, 237, 0.05)'
    }}>
      <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
        Cloud sync
      </h3>
      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-neutral-400)', textWrap: 'pretty' }}>
        Everything is saved on this device already in localStorage. Paste a Firebase web config to sync to Firestore, and your marks follow you to your phone or tablet in real time.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dotColor }} />
        <span style={{ color: 'var(--color-neutral-300)', fontWeight: 500 }}>
          {statusLabel}
        </span>
      </div>

      <div className="field">
        <label htmlFor="fbcfg">Firebase config (JSON)</label>
        <textarea
          id="fbcfg"
          className="input"
          spellCheck={false}
          placeholder='{ "apiKey": "…", "authDomain": "…", "projectId": "…", "appId": "…" }'
          value={localText}
          onChange={(e) => {
            setLocalText(e.target.value);
            firebase.setText(e.target.value);
          }}
          style={{
            minHeight: '118px',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '12px',
            lineHeight: 1.4
          }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={() => firebase.connect(localText)}
          className="btn btn-primary"
        >
          Connect &amp; sync
        </button>
        <button
          onClick={() => {
            firebase.disconnect();
            setLocalText('');
          }}
          className="btn btn-secondary"
        >
          Disconnect
        </button>
      </div>

      <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-neutral-600)', textWrap: 'pretty' }}>
        Requires Anonymous sign-in enabled and a Firestore security rule allowing signed-in users to read/write under <span style={{ fontFamily: 'ui-monospace, monospace' }}>attendance/{'{uid}'}</span>.
      </p>
    </div>
  );
};
