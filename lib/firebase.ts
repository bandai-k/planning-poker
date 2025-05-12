// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJzk4WQQE-x5-atkLiqAOWlt-Cq7v8L1A",
  authDomain: "planning-poker-app-2e033.firebaseapp.com",
  databaseURL: "https://planning-poker-app-2e033-default-rtdb.firebaseio.com",
  projectId: "planning-poker-app-2e033",
  storageBucket: "planning-poker-app-2e033.firebasestorage.app",
  messagingSenderId: "294806159247",
  appId: "1:294806159247:web:f3849d7a3aa5d99c4895fa",
  measurementId: "G-ZFEQ37VZKJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);