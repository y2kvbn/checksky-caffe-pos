
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwtoZJ1cLsx4EzL1OOpmGkwsp_Gf1tn_k",
  authDomain: "aicheck-squad.firebaseapp.com",
  projectId: "aicheck-squad",
  storageBucket: "aicheck-squad.appspot.com",
  messagingSenderId: "528444835025",
  appId: "1:528444835025:web:855a64beeeea4a71d6f1f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
