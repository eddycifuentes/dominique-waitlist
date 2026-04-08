import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDebBr3Y95Nimt68tngW9s-aFE7TR-rtPY",
  authDomain: "sb-dominique-prod.firebaseapp.com",
  projectId: "sb-dominique-prod",
  storageBucket: "sb-dominique-prod.appspot.com",
  messagingSenderId: "955086542186",
  appId: "1:955086542186:web:437cce52f27d2d9d3dc113",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "dominique-waitlist1");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
