// Import the functions you need from the SDKs you need
import { initializeApp,  } from "firebase/app";
import { getAuth, FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvI2OesCQQyDTqiUKnSAYJ3j3azdCcW1Y",
  authDomain: "power-blogs-eb63f.firebaseapp.com",
  projectId: "power-blogs-eb63f",
  storageBucket: "power-blogs-eb63f.appspot.com",
  messagingSenderId: "709850767050",
  appId: "1:709850767050:web:b5de4b2bbd927e30315e33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db=getFirestore(app);

const provider = new FacebookAuthProvider();

export const database = getFirestore(app)

const imgDB = getStorage(app)
const txtDB = getFirestore(app)
const storage = getStorage(app)

const providers = new GoogleAuthProvider();

const firestore = getFirestore(app);

export {auth,imgDB,txtDB,storage,firestore, provider, providers}