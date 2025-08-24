import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, getDocs, DocumentData } from 'firebase/firestore';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyBpPrMPZGmqo_jku2yNULqyWJeD5o1v7Z4',
  authDomain: 'eventify-43e64.firebaseapp.com',
  projectId: 'eventify-43e64',
  storageBucket: 'eventify-43e64.firebasestorage.app',
  messagingSenderId: '507254612219',
  appId: '1:507254612219:web:68d93fd5486e705697905e',
  measurementId: 'G-2SGNY716EK',
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Gemini AI
const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

// Firestore Event Data Interface
interface Event {
  name: string;
  date: string;
  description?: string;
}

// Fetch events from Firestore
  const fetchEvents = async (): Promise<Event[]> => {
  const eventsRef = collection(db, 'events'); // Access the 'events' collection
  const eventSnapshot = await getDocs(eventsRef); // Fetch documents from the collection
  const eventsList: Event[] = eventSnapshot.docs.map(doc => doc.data() as Event); // Map over documents and cast to Event type
  return eventsList;
};

// Exporting other necessary Firebase features
const googleProvider = new GoogleAuthProvider();
export { auth, googleProvider, db, model, fetchEvents };
