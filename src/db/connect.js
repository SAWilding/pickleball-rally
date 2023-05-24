// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "pickleball-rally.firebaseapp.com",
  projectId: "pickleball-rally",
  storageBucket: "pickleball-rally.appspot.com",
  messagingSenderId: "468738880005",
  appId: "1:468738880005:web:3d3bb20a9e88b378f4626c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = { db, collection, addDoc };
