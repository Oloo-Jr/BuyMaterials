// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB8TrvL1LSZTRn9CU9CAusqyiJYFcshO6k",
    authDomain: "buy-materials.firebaseapp.com",
    projectId: "buy-materials",
    storageBucket: "buy-materials.appspot.com",
    messagingSenderId: "1057530044230",
    appId: "1:1057530044230:web:141929ef1efa607dea8f47",
    measurementId: "G-WVZ76RPD8F"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = firebase.firestore();
export const storage = firebase.storage();
export const storageRef = storage.ref();
export const auth = firebase.auth()