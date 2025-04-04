import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC0VQoZ1U-3-J3bW5qVCVUdJB3xFdvw8MU",
  authDomain: "ride-share-679fa.firebaseapp.com",
  projectId: "ride-share-679fa",
  storageBucket: "ride-share-679fa.firebasestorage.app",
  messagingSenderId: "358950265394",
  appId: "1:358950265394:web:9dc9edcc9fe4812772522b",
  measurementId: "G-7XP3VTKQHG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
try {
  auth = getAuth(app);
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { auth };
