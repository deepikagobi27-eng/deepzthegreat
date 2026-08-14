import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB9BXX5XwdFgBdkHJ9z3QalI-wlnT5J4ck",
  authDomain: "deepzthegreat-33a00.firebaseapp.com",
  databaseURL: "https://deepzthegreat-33a00-default-rtdb.firebaseio.com",
  projectId: "deepzthegreat-33a00",
  storageBucket: "deepzthegreat-33a00.firebasestorage.app",
  messagingSenderId: "678355955824",
  appId: "1:678355955824:web:7c7505687a010856b644b5",
  measurementId: "G-WH2ZBV9XHE"
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db };