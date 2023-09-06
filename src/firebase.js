
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth"; 
// import { getFirestore } from "firebase/firestore"; 
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'



const firebaseConfig = {
    apiKey: "AIzaSyAAKWjPp8uD0LkB3FLkDihwnTvL1ApDFcs",
    authDomain: "project-k-prt.firebaseapp.com",
    projectId: "project-k-prt",
    storageBucket: "project-k-prt.appspot.com",
    messagingSenderId: "435428951906",
    appId: "1:435428951906:web:735280db7e3fad5b8c8e3b"
};
 
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export default {app, auth};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
export { auth, firestore };
export default firebase;