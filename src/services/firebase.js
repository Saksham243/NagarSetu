// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD9L43Jnr4fiC3OOLoB2Y9A7LTRQ9UyA7E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "publicsetu-21ebe.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "publicsetu-21ebe",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "publicsetu-21ebe.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "989516597694",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:989516597694:web:6ad5eced7d82dd05fa51ef"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
