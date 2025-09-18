// Import Firebase modules from CDN
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// IMPORTANT: Replace with your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAucvfbAI9s10ak99I7YLAPb5VskQoOlNI",
  authDomain: "schlauarbeitneu.firebaseapp.com",
  projectId: "schlauarbeitneu",
  storageBucket: "schlauarbeitneu.firebasestorage.app",
  messagingSenderId: "332216095076",
  appId: "1:332216095076:web:ed24bc7d079b8dccf92a71",
  measurementId: "G-Q2L5LGK4BW"
};

// Initialize Firebase safely
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Get the already initialized app
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Export the necessary Firebase services
export { auth, db, googleProvider };
