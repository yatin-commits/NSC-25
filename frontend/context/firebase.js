import { initializeApp } from "@firebase/app";
import { getAuth,GoogleAuthProvider } from "@firebase/auth";
import { getAnalytics } from "@firebase/analytics";

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

// Initialize services
console.log("just initialized the app");

const auth = getAuth(app);
console.log("just initialized the auth service");

const googleProvider = new GoogleAuthProvider();

// Set up auth settings if needed
auth.useDeviceLanguage();

// Export the services
export { auth, googleProvider };