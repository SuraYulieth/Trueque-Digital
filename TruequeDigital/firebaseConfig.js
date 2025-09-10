// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgdykqFzn3wm91E_cXi29uXVdzznx9aMY",
  authDomain: "trueque-digital-23bbd.firebaseapp.com",
  projectId: "trueque-digital-23bbd",
  storageBucket: "trueque-digital-23bbd.firebasestorage.app",
  messagingSenderId: "766237345127",
  appId: "1:766237345127:web:8c017a4f53469701681bc2",
  measurementId: "G-RG6GLHQVJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };