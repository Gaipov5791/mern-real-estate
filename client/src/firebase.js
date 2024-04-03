// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-861ca.firebaseapp.com",
  projectId: "mern-estate-861ca",
  storageBucket: "mern-estate-861ca.appspot.com",
  messagingSenderId: "241652812262",
  appId: "1:241652812262:web:42816644952ec1d7032e27"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);