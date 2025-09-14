// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgdykqFzn3wm91E_cXi29uXVdzznx9aMY",
  authDomain: "trueque-digital-23bbd.firebaseapp.com",
  projectId: "trueque-digital-23bbd",
  storageBucket: "trueque-digital-23bbd.appspot.com", // <- importante
  messagingSenderId: "766237345127",
  appId: "1:766237345127:web:8c017a4f53469701681bc2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
