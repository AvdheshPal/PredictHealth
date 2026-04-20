import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDJXw9Wh3CKQfKhufSXu99zHvD4hquWi2Y",
  authDomain: "predict-health-mca.firebaseapp.com",
  projectId: "predict-health-mca",
  storageBucket: "predict-health-mca.firebasestorage.app",
  messagingSenderId: "910808870670",
  appId: "1:910808870670:web:d21489e87778b9f9f9315f",
  measurementId: "G-TTR3G7T68H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
