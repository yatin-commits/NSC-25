import { initializeApp } from "@firebase/app";
import { getAuth,GoogleAuthProvider } from "@firebase/auth";
import { getAnalytics } from "@firebase/analytics";
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
console.log("just initialized the app");

const auth = getAuth(app);
console.log("just initialized the auth service");

const googleProvider = new GoogleAuthProvider();


export { auth, googleProvider };