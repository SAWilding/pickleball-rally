// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "@firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjPMZQEc02v7sDOyk6ARuiet75HobqAh0",
  authDomain: "pickleball-rally.firebaseapp.com",
  projectId: "pickleball-rally",
  storageBucket: "pickleball-rally.appspot.com",
  messagingSenderId: "468738880005",
  appId: "1:468738880005:web:3d3bb20a9e88b378f4626c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

module.exports = {
  db,
  auth,
  signInWithEmailAndPassword,
  collection,
  addDoc,
  getDocs,
  query,
  where,
};
