// backend/firebase/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKeAPiGZWI9jOny4bdiJ9Jn2wOq3ZIQ3A",
  authDomain: "bvicam-nsc.firebaseapp.com",
  projectId: "bvicam-nsc",
  storageBucket: "bvicam-nsc.firebasestorage.app",
  messagingSenderId: "920684654682",
  appId: "1:920684654682:web:ddcfc9bb545669c5fb6863",
  measurementId: "G-QL7CNYZ9GH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("just initialized the app", app);

// Initialize services
const auth = getAuth(app);
console.log("just initialized the auth service");

const googleProvider = new GoogleAuthProvider();

// Set up auth settings if needed
auth.useDeviceLanguage();

// Export the services
export { auth, googleProvider };