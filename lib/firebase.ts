import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
apiKey: "AIzaSyDZZwMd2-gao1LHX_o5X1gO6XlHCPk9Yb0",
authDomain: "cityfix-98b84.firebaseapp.com",
projectId: "cityfix-98b84",
storageBucket: "cityfix-98b84.firebasestorage.app",
messagingSenderId: "63479200805",
appId: "1:63479200805:web:e3e439c96035d0cfdc53cc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Export Firestore
export const db = getFirestore(app);

// 🔐 Export Auth (THIS WAS MISSING)
export const auth = getAuth(app);
