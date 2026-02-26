// Firebase Core
import { initializeApp } from "firebase/app";

// Firebase Services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// 🔐 Your Firebase Configuration
const firebaseConfig = {
 apiKey: "AIzaSyCLlmOA4KAZcwd1zVGUi1hTGptcihlADJc",
  authDomain: "movies-b0c73.firebaseapp.com",
  projectId: "movies-b0c73",
  storageBucket: "movies-b0c73.firebasestorage.app",
  messagingSenderId: "629140249533",
  appId: "1:629140249533:web:285239d2cefd552c4b50d4",
  measurementId: "G-938K0JV91V"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔑 Firebase Auth
export const auth = getAuth(app);

// 🗄 Firestore Database
export const db = getFirestore(app);

// 📊 Analytics (Only works in browser)
export let analytics: any = null;

isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export default app;
