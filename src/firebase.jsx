import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFboaaHKi5JIdQM3KAf1R3eN14YcBHJqs",
  authDomain: "nuel-s-store.firebaseapp.com",
  projectId: "nuel-s-store",
  storageBucket: "nuel-s-store.appspot.com",
  messagingSenderId: "20597169579",
  appId: "1:20597169579:web:4720fb8c6b672d93be46ee",
  measurementId: "G-50MPSQ2BDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Export the Storage instance

