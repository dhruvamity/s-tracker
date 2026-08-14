export const BASE_HELD = 32;
export const BASE_ATT = 27;

export const DEFAULT_TARGET_PERCENT = 75;
export const DEFAULT_RESERVE_DAYS = 5;

export const STORAGE_KEYS = {
  MARKS: 'saanvi-sem5-attendance-v1',
  FIREBASE: 'saanvi-sem5-attendance-v1:fb',
  SETTINGS: 'saanvi-sem5-attendance-settings'
};

export const THEME_COLORS = {
  GREEN: 'var(--color-accent)',
  GREEN_BRIGHT: '#9184d9',
  RED: 'oklch(0.66 0.14 25)',
  AMBER: 'oklch(0.72 0.13 78)',
  MUTED: 'var(--color-neutral-600)',
  SURFACE: 'var(--color-surface)',
  DIVIDER: 'var(--color-divider)'
};

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDdsmJQDDIE-r7XdkDiQ1EzZO1-KCiAPrA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sdtracker-bf448.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sdtracker-bf448",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sdtracker-bf448.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "745258135763",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:745258135763:web:434a00592b8254172ba426"
};

export const ENV_FIREBASE_CONFIG = JSON.stringify(DEFAULT_FIREBASE_CONFIG, null, 2);

