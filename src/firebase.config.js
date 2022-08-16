// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdWjwYPFnm87S7aorDhF4WPztIsftcA2E",
  authDomain: "house-marketplace-app-bfe95.firebaseapp.com",
  projectId: "house-marketplace-app-bfe95",
  storageBucket: "house-marketplace-app-bfe95.appspot.com",
  messagingSenderId: "1094237275451",
  appId: "1:1094237275451:web:9cea7a7119d4630edaa31e"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()