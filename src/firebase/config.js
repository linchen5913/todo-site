import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsYd0J3l9yhZwRK23lRvrH7dZDp4vjb7U",
  authDomain: "count-down-ef86d.firebaseapp.com",
  projectId: "count-down-ef86d",
  storageBucket: "count-down-ef86d.appspot.com",
  messagingSenderId: "134218050500",
  appId: "1:134218050500:web:429726bac45337d7651291",
};

//init firebase
firebase.initializeApp(firebaseConfig);

//init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

//timestamp
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, timestamp, projectStorage };
