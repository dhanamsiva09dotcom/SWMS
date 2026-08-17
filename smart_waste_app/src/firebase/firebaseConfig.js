// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_PjfRAT72lfKLF9W1gcR2lDpg9KF1VMA",
  authDomain: "swms-map-24e61.firebaseapp.com",
  databaseURL: "https://swms-map-24e61-default-rtdb.firebaseio.com",
  projectId: "swms-map-24e61",
  storageBucket: "swms-map-24e61.firebasestorage.app",
  messagingSenderId: "137521065752",
  appId: "1:137521065752:web:1c9eb4d8c26fec31e1386d",
  measurementId: "G-027F2ZEW9Y"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Realtime database
export const db = getDatabase(app);

// Firebase authentication
export const auth = getAuth(app);
