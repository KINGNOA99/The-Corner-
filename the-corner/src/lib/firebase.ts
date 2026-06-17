import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkPLh_8S-Isop4luqqHhChZ_o9Y3GP2Ac",
  authDomain: "the-corner-c23e5.firebaseapp.com",
  projectId: "the-corner-c23e5",
  storageBucket: "the-corner-c23e5.firebasestorage.app",
  messagingSenderId: "629038916434",
  appId: "1:629038916434:web:3b1b848471ea53f1f5908b"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
