import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updatePassword, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyB67N3sWh-3_qT8GxBBmcrZNPNkhJ23k94",
  authDomain: "rydeon-8e939.firebaseapp.com",
  projectId: "rydeon-8e939",
  storageBucket: "rydeon-8e939.firebasestorage.app",
  messagingSenderId: "450128432272",
  appId: "1:450128432272:web:479501e4ca4cfb8f74dc15",
  measurementId: "G-QQ487LNJZP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signupWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const updateUserPassword = (user, newPassword) => updatePassword(user, newPassword);
export const loginWithCustomToken = (token) => signInWithCustomToken(auth, token);
export const logout = () => signOut(auth);
