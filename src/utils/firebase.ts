import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, Auth } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, Firestore, DocumentReference, Unsubscribe } from 'firebase/firestore';
import { MarksMap } from '../types/attendance';

export interface FirebaseSyncService {
  connect: (
    rawConfig: string,
    onRemoteUpdate: (marks: MarksMap, updatedAt: number) => void,
    onStatusChange: (status: 'connecting' | 'live' | 'error', message: string) => void
  ) => Promise<boolean>;
  push: (marks: MarksMap, updatedAt: number) => Promise<void>;
  disconnect: () => void;
}

class FirebaseService implements FirebaseSyncService {
  private db: Firestore | null = null;
  private docRef: DocumentReference | null = null;
  private unsubscribe: Unsubscribe | null = null;
  private app: FirebaseApp | null = null;

  async connect(
    rawConfig: string,
    onRemoteUpdate: (marks: MarksMap, updatedAt: number) => void,
    onStatusChange: (status: 'connecting' | 'live' | 'error', message: string) => void
  ): Promise<boolean> {
    const src = String(rawConfig || '').trim();
    if (!src) {
      onStatusChange('error', 'Firebase config missing.');
      return false;
    }

    let configObj: Record<string, any>;
    try {
      const cleaned = src
        .replace(/^[^{]*/, '')
        .replace(/([,{]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":')
        .replace(/'/g, '"')
        .replace(/,\s*}/g, '}');
      configObj = JSON.parse(cleaned);
    } catch {
      onStatusChange('error', 'Invalid Firebase config format.');
      return false;
    }

    onStatusChange('connecting', 'Connecting to cloud database…');

    try {
      this.app = getApps().length > 0 ? getApps()[0] : initializeApp(configObj);
      this.db = getFirestore(this.app);

      // Attempt anonymous auth if available
      try {
        const auth: Auth = getAuth(this.app);
        await signInAnonymously(auth);
      } catch (authErr) {
        console.warn('Anonymous auth note (proceeding directly to Firestore):', authErr);
      }

      // Shared document path for Saanvi's attendance across all devices
      this.docRef = doc(this.db, 'attendance', 'saanvi_sem5');

      if (this.unsubscribe) {
        this.unsubscribe();
      }

      this.unsubscribe = onSnapshot(
        this.docRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data && typeof data.updatedAt === 'number') {
              onRemoteUpdate(data.marks || {}, data.updatedAt);
            }
          }
        },
        (error) => {
          console.error('Firestore listener error:', error);
          onStatusChange('error', 'Firestore permission denied. Check security rules in Firebase Console.');
        }
      );

      onStatusChange('live', 'Live Cloud Sync Active');
      return true;
    } catch (err: any) {
      const code = err?.code || '';
      const msg = String(err?.message || err);
      let userFriendlyMsg = msg;

      if (code === 'permission-denied' || msg.includes('permission-denied')) {
        userFriendlyMsg = 'Firestore permission denied: allow read, write on attendance collection in Firebase Console.';
      }

      console.error('Firebase connection error:', err);
      onStatusChange('error', userFriendlyMsg);
      return false;
    }
  }

  async push(marks: MarksMap, updatedAt: number): Promise<void> {
    if (!this.docRef) {
      console.warn('Cannot push to Firestore: not connected');
      return;
    }
    try {
      await setDoc(this.docRef, { marks, updatedAt });
    } catch (err) {
      console.warn('Firebase push failed:', err);
    }
  }

  disconnect(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.docRef = null;
    this.db = null;
    this.app = null;
  }
}

export const firebaseService = new FirebaseService();

