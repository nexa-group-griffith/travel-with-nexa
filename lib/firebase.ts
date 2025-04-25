import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';
import { type FirebaseStorage, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAyWBNoE-ZFXUZ7_rmFkTJJ0Q2CO9KhamY',
  authDomain: 'nexa-travel-app.firebaseapp.com',
  projectId: 'nexa-travel-app',
  storageBucket: 'nexa-travel-app.firebasestorage.app',
  messagingSenderId: '659743073979',
  appId: '1:659743073979:web:4619ed255b2e35e6a62b9e',
  measurementId: 'G-7QX2KGGG9W',
};

const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (hasValidConfig) {
  try {
    app = getApps()?.length ? getApp() : initializeApp(firebaseConfig);

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    if (typeof window !== 'undefined') {
      console.log('Current domain:', window.location.hostname);
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn(
    'Firebase config is missing or incomplete. Firebase services will not be available.'
  );
}

export { app, auth, db, storage };
