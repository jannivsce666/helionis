// Import Firebase modules from CDN
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Get Firebase instances from global window
const auth = window.firebaseAuth;
const db = window.firebaseDb;
const analytics = window.firebaseAnalytics;

export { auth, db, analytics };
export {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
};
