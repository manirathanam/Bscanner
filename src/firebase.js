// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1DyRF9Em5bV61c-V3lgN74b9zAqa7ZQg",
  authDomain: "maximal-storm-414207.firebaseapp.com",
  projectId: "maximal-storm-414207",
  storageBucket: "maximal-storm-414207.appspot.com",
  messagingSenderId: "275452910056",
  appId: "1:275452910056:web:5a7a2d284650cbee87ac5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db  = getFirestore(app);
const storage = getStorage(app);

export { app,auth,db,storage};
