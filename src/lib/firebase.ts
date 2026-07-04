import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  deleteDoc
} from "firebase/firestore";

// Firebase Config obtained from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyDZn4YSLo7q7G6it6OwcYmDJgpDF1XxDi4",
  authDomain: "ai-legal-1b62b.firebaseapp.com",
  projectId: "ai-legal-1b62b",
  storageBucket: "ai-legal-1b62b.firebasestorage.app",
  messagingSenderId: "923554069529",
  appId: "1:923554069529:web:ce18e8e3ca274b5d5b7e88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Sign-In Provider
export const googleProvider = new GoogleAuthProvider();

// Standard Firebase Auth Helpers
export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  deleteDoc
};
export type { FirebaseUser };
