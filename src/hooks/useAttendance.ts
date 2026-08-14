import { useState, useEffect, useMemo, useCallback } from 'react';
import { MarksMap, MarkStatus, FirebaseSyncState } from '../types/attendance';
import { STORAGE_KEYS, DEFAULT_TARGET_PERCENT, DEFAULT_RESERVE_DAYS, ENV_FIREBASE_CONFIG } from '../constants/config';
import { TRACK_FROM } from '../constants/calendar';
import { getLecturesOnDate, calculateAttendanceStats, calculateSubjectExposure, calculateWeeklyTrends } from '../utils/attendanceMath';
import { firebaseService } from '../utils/firebase';

export function useAttendance(nowIST: Date) {
  const [marks, setMarks] = useState<MarksMap>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MARKS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.marks || {};
      }
    } catch (e) {
      console.error('Failed to load marks from localStorage:', e);
    }
    return {};
  });

  const [updatedAt, setUpdatedAt] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MARKS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.updatedAt || Date.now();
      }
    } catch {
      // fallback
    }
    return Date.now();
  });

  const [targetPercent, setTargetPercent] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.targetPercent === 'number') return parsed.targetPercent;
      }
    } catch {}
    return DEFAULT_TARGET_PERCENT;
  });

  const [reserveDays, setReserveDays] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.reserveDays === 'number') return parsed.reserveDays;
      }
    } catch {}
    return DEFAULT_RESERVE_DAYS;
  });

  // Firebase state (defaults to ENV_FIREBASE_CONFIG if set)
  const [fbConfigText, setFbConfigText] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.FIREBASE) || ENV_FIREBASE_CONFIG || '';
  });
  const [fbStatus, setFbStatus] = useState<FirebaseSyncState>('idle');
  const [fbMessage, setFbMessage] = useState<string>('');

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ targetPercent, reserveDays }));
    } catch (e) {
      console.warn('Failed to save settings to localStorage:', e);
    }
  }, [targetPercent, reserveDays]);

  // Persist marks & auto-push to Firebase
  const persistAndSync = useCallback((newMarks: MarksMap, ts: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify({ marks: newMarks, updatedAt: ts }));
    } catch (e) {
      console.warn('Failed to save marks to localStorage:', e);
    }
    firebaseService.push(newMarks, ts);
  }, []);

  // Connect Firebase on mount if saved or pre-configured in .env
  useEffect(() => {
    const configToUse = localStorage.getItem(STORAGE_KEYS.FIREBASE) || ENV_FIREBASE_CONFIG;
    if (configToUse) {
      firebaseService.connect(
        configToUse,
        (remoteMarks, remoteUpdatedAt) => {
          if (remoteUpdatedAt > updatedAt) {
            setMarks(remoteMarks);
            setUpdatedAt(remoteUpdatedAt);
            try {
              localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify({ marks: remoteMarks, updatedAt: remoteUpdatedAt }));
            } catch {}
          }
        },
        (status, message) => {
          setFbStatus(status);
          setFbMessage(message);
        }
      );
    }
  }, []);

  // Actions
  const toggleMark = useCallback((dateKey: string, lectureIndex: number, status: MarkStatus) => {
    if (dateKey < TRACK_FROM) return;

    setMarks((prev) => {
      const dayMarks = { ...(prev[dateKey] || {}) };
      if (dayMarks[lectureIndex] === status) {
        delete dayMarks[lectureIndex];
      } else {
        dayMarks[lectureIndex] = status;
      }

      const nextMarks = { ...prev };
      if (Object.keys(dayMarks).length > 0) {
        nextMarks[dateKey] = dayMarks;
      } else {
        delete nextMarks[dateKey];
      }

      const ts = Date.now();
      setUpdatedAt(ts);
      persistAndSync(nextMarks, ts);
      return nextMarks;
    });
  }, [persistAndSync]);

  const setDayMarks = useCallback((dateKey: string, status: MarkStatus | null) => {
    if (dateKey < TRACK_FROM) return;

    setMarks((prev) => {
      const nextMarks = { ...prev };
      if (status === null) {
        delete nextMarks[dateKey];
      } else {
        const dayMarks: Record<number, MarkStatus> = {};
        const lectures = getLecturesOnDate(dateKey);
        lectures.forEach((_, idx) => {
          dayMarks[idx] = status;
        });
        nextMarks[dateKey] = dayMarks;
      }

      const ts = Date.now();
      setUpdatedAt(ts);
      persistAndSync(nextMarks, ts);
      return nextMarks;
    });
  }, [persistAndSync]);

  const clearAllMarks = useCallback(() => {
    const nextMarks: MarksMap = {};
    const ts = Date.now();
    setMarks(nextMarks);
    setUpdatedAt(ts);
    persistAndSync(nextMarks, ts);
  }, [persistAndSync]);

  const connectFirebase = useCallback(async (configString: string) => {
    setFbConfigText(configString);
    localStorage.setItem(STORAGE_KEYS.FIREBASE, configString);
    await firebaseService.connect(
      configString,
      (remoteMarks, remoteUpdatedAt) => {
        setMarks(remoteMarks);
        setUpdatedAt(remoteUpdatedAt);
        try {
          localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify({ marks: remoteMarks, updatedAt: remoteUpdatedAt }));
        } catch {}
      },
      (status, message) => {
        setFbStatus(status);
        setFbMessage(message);
      }
    );
  }, []);

  const disconnectFirebase = useCallback(() => {
    firebaseService.disconnect();
    localStorage.removeItem(STORAGE_KEYS.FIREBASE);
    setFbStatus('idle');
    setFbMessage('');
  }, []);

  const exportBackup = useCallback(() => {
    const backup = {
      marks,
      updatedAt,
      targetPercent,
      reserveDays,
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `attendance-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [marks, updatedAt, targetPercent, reserveDays]);

  const importBackup = useCallback((jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed.marks && typeof parsed.marks === 'object') {
        const nextMarks = parsed.marks;
        const ts = Date.now();
        setMarks(nextMarks);
        setUpdatedAt(ts);
        if (typeof parsed.targetPercent === 'number') setTargetPercent(parsed.targetPercent);
        if (typeof parsed.reserveDays === 'number') setReserveDays(parsed.reserveDays);
        persistAndSync(nextMarks, ts);
        return true;
      }
    } catch (e) {
      console.error('Import backup failed:', e);
    }
    return false;
  }, [persistAndSync]);

  // Derived statistics (memoized)
  const stats = useMemo(() => {
    return calculateAttendanceStats(marks, targetPercent, nowIST);
  }, [marks, targetPercent, nowIST]);

  const subjects = useMemo(() => {
    return calculateSubjectExposure(marks, targetPercent);
  }, [marks, targetPercent]);

  const trends = useMemo(() => {
    return calculateWeeklyTrends(marks, targetPercent);
  }, [marks, targetPercent]);

  return {
    marks,
    updatedAt,
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
    firebase: {
      text: fbConfigText,
      setText: setFbConfigText,
      status: fbStatus,
      message: fbMessage,
      connect: connectFirebase,
      disconnect: disconnectFirebase
    }
  };
}
