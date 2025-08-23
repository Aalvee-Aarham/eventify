import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Define the Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyBpPrMPZGmqo_jku2yNULqyWJeD5o1v7Z4',
  authDomain: 'eventify-43e64.firebaseapp.com',
  projectId: 'eventify-43e64',
  storageBucket: 'eventify-43e64.firebasestorage.app',
  messagingSenderId: '507254612219',
  appId: '1:507254612219:web:68d93fd5486e705697905e',
  measurementId: 'G-2SGNY716EK',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set persistence to localStorage for session persistence
auth.setPersistence(browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to localStorage.");
    // Now you can proceed with authentication operations like signup or login
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Initialize Firestore
export const db = getFirestore(app);  // Initialize Firestore

// Google Authentication Provider
const googleProvider = new GoogleAuthProvider();

// Export auth and googleProvider
export { auth, googleProvider };
