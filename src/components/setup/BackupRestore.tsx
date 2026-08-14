import React, { useRef, useState } from 'react';
import { DownloadSimple, UploadSimple, CheckCircle } from '@phosphor-icons/react';

interface BackupRestoreProps {
  onExport: () => void;
  onImport: (content: string) => boolean;
}

export const BackupRestore: React.FC<BackupRestoreProps> = ({ onExport, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImport(content);
      if (success) {
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Failed to restore backup: invalid JSON format.');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
        Backup &amp; Restore
      </h3>
      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-neutral-400)', textWrap: 'pretty' }}>
        Export your marks and settings to a JSON file to transfer between browsers, devices, or keep an offline copy.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={onExport}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <DownloadSimple size={16} />
          Export JSON
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <UploadSimple size={16} />
          Import JSON
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {importStatus && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: importStatus.includes('success') ? 'var(--color-accent)' : 'oklch(0.66 0.14 25)'
        }}>
          <CheckCircle size={15} />
          {importStatus}
        </div>
      )}
    </div>
  );
};
