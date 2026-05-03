import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBTwyWTwZ7lDHM4bQ1L-qgoR2rXWGQlOhE',
  authDomain: 'smartfund-manager.firebaseapp.com',
  projectId: 'smartfund-manager',
  storageBucket: 'smartfund-manager.firebasestorage.app',
  messagingSenderId: '169594247602',
  appId: '1:169594247602:web:e3ed6548ec3f6615736cab',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // Initialize and export Firebase Auth
