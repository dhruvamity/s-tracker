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
  private docRef: any = null;
  private fsModule: any = null;
  private unsubscribe: (() => void) | null = null;

  async connect(
    rawConfig: string,
    onRemoteUpdate: (marks: MarksMap, updatedAt: number) => void,
    onStatusChange: (status: 'connecting' | 'live' | 'error', message: string) => void
  ): Promise<boolean> {
    const src = String(rawConfig || '').trim();
    if (!src) {
      onStatusChange('error', 'Paste your Firebase web config first.');
      return false;
    }

    let configObj: Record<string, any>;
    try {
      // Clean and parse JS object or JSON format
      const cleaned = src
        .replace(/^[^{]*/, '')
        .replace(/([,{]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":')
        .replace(/'/g, '"')
        .replace(/,\s*}/g, '}');
      configObj = JSON.parse(cleaned);
    } catch {
      onStatusChange('error', 'That config is not valid JSON.');
      return false;
    }

    onStatusChange('connecting', 'Connecting to Firestore…');

    try {
      const base = 'https://www.gstatic.com/firebasejs/10.12.5/';
      const [appModule, authModule, firestoreModule] = await Promise.all([
        import(/* @vite-ignore */ `${base}firebase-app.js`),
        import(/* @vite-ignore */ `${base}firebase-auth.js`),
        import(/* @vite-ignore */ `${base}firebase-firestore.js`)
      ]);

      const app = appModule.getApps && appModule.getApps().length
        ? appModule.getApps()[0]
        : appModule.initializeApp(configObj);

      const db = firestoreModule.getFirestore(app);

      // Attempt anonymous auth if available, but don't fail if anonymous auth is not required by rules
      try {
        const auth = authModule.getAuth(app);
        await authModule.signInAnonymously(auth);
      } catch (authErr) {
        console.warn('Anonymous auth note (proceeding to Firestore):', authErr);
      }

      this.fsModule = firestoreModule;
      // All devices for Saanvi connect to the same shared attendance document
      this.docRef = firestoreModule.doc(db, 'attendance', 'saanvi_sem5');

      if (this.unsubscribe) {
        this.unsubscribe();
      }

      this.unsubscribe = firestoreModule.onSnapshot(
        this.docRef,
        (snap: any) => {
          if (!snap.exists || snap.exists()) {
            const data = snap.data();
            if (data && typeof data.updatedAt === 'number') {
              onRemoteUpdate(data.marks || {}, data.updatedAt);
            }
          }
        },
        (error: any) => {
          onStatusChange('error', 'Firestore sync permission issue. Verify security rules in Firebase Console.');
          console.error('Firestore listener error:', error);
        }
      );

      onStatusChange('live', 'Live Cloud Sync Active');
      return true;
    } catch (err: any) {
      const code = err?.code || '';
      const msg = String(err?.message || err);
      let userFriendlyMsg = msg;

      if (code === 'permission-denied' || msg.includes('permission-denied')) {
        userFriendlyMsg = 'Firestore permission denied: Update Firestore Security Rules to allow read/write on attendance collection.';
      }

      onStatusChange('error', userFriendlyMsg);
      return false;
    }
  }

  async push(marks: MarksMap, updatedAt: number): Promise<void> {
    if (!this.docRef || !this.fsModule) return;
    try {
      await this.fsModule.setDoc(
        this.docRef,
        { marks, updatedAt }
      );
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
    this.fsModule = null;
  }
}

export const firebaseService = new FirebaseService();
