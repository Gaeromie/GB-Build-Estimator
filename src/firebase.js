import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlY7raPw7XxI4Ng_qKWFotMfQDLUx8Oow",
  authDomain: "gb-build-estimator.firebaseapp.com",
  projectId: "gb-build-estimator",
  storageBucket: "gb-build-estimator.firebasestorage.app",
  messagingSenderId: "742999455960",
  appId: "1:742999455960:web:5c3618b40086c3307f7fad"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
