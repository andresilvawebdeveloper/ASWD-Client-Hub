import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7L5pquR4Wo3wQ-qTzmm_TSLgPf863bJ4",
  authDomain: "aswd-client-hub.firebaseapp.com",
  projectId: "aswd-client-hub",
  storageBucket: "aswd-client-hub.firebasestorage.app",
  messagingSenderId: "497565946234",
  appId: "1:497565946234:web:a30ea21a5ac4ad25a706c3"
};

// Padrão para evitar inicializar o Firebase várias vezes no Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
