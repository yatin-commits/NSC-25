// src/firebase.js (or wherever you initialize Firebase)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDKeAPiGZWI9jOny4bdiJ9Jn2wOq3ZIQ3A",
  authDomain: "bvicam-nsc.firebaseapp.com",
  projectId: "bvicam-nsc",
  storageBucket: "bvicam-nsc.firebasestorage.app",
  messagingSenderId: "920684654682",
  appId: "1:920684654682:web:ddcfc9bb545669c5fb6863",
  measurementId: "G-QL7CNYZ9GH"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

export { auth }; // Export auth for use in other files