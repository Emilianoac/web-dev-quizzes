// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5kLah3Sr5zcfWTSm05IX2obU1M7TlEd0",
  authDomain: "ad3s3cv.firebaseapp.com",
  projectId: "ad3s3cv",
  storageBucket: "ad3s3cv.appspot.com",
  messagingSenderId: "697179888898",
  appId: "1:697179888898:web:274bcd0f762536c0d6f61b"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db