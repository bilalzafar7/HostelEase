import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from '@firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCBAF5b-pHfpDbLsOxCA9lKlwEyQYr6iew",
  authDomain: "hostelease-41759.firebaseapp.com",
  projectId: "hostelease-41759",
  storageBucket: "hostelease-41759.appspot.com",
  messagingSenderId: "603853185486",
  appId: "1:603853185486:web:ccf3e8d7ef13efb8bf0b9f"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore();
const storage = getStorage(app);

export { auth, db, storage };
