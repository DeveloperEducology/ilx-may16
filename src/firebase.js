import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCnQJhNzPILgrPrmDDgRywM-6unRp6gz1s",
  authDomain: "fir-learning-29cf4.firebaseapp.com",
  projectId: "fir-learning-29cf4",
  storageBucket: "fir-learning-29cf4.appspot.com",
  messagingSenderId: "711378401773",
  appId: "1:711378401773:web:c6a2f7fb0eb612c42f4fe4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app);
export default app;
