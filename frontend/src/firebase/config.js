// firebase/config.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  onAuthStateChanged 
} from "firebase/auth";

// Your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-rJ0Fai2CSoAFdRftb2oQwfj5qPxEIFk",
  authDomain: "tv-show-merch.firebaseapp.com",
  projectId: "tv-show-merch",
  storageBucket: "tv-show-merch.firebasestorage.app",
  messagingSenderId: "298635594931",
  appId: "1:298635594931:web:24ba24bd2cf9a5f299f4c6",
  measurementId: "G-F2PK92Y4C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
};