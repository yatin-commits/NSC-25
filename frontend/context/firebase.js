import { initializeApp } from "@firebase/app";
import { getAuth,GoogleAuthProvider } from "@firebase/auth";
import { getAnalytics } from "@firebase/analytics";
// import dotenv from "dotenv";
// dotenv.config({ path: '../.env' }); // Adjust the path to your .env file
console.log(import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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