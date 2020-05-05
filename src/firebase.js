import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
	apiKey: "AIzaSyDGqgDVwB1w7aNqGkSQR2chFQ6VYd50mR8",
	authDomain: "planner-e8324.firebaseapp.com",
	databaseURL: "https://planner-e8324.firebaseio.com",
	projectId: "planner-e8324",
	storageBucket: "planner-e8324.appspot.com",
	messagingSenderId: "566179843001",
	appId: "1:566179843001:web:65a66977662735af208468",
};

firebase.initializeApp(config);

const db = firebase.firestore();

const firebaseAuth = firebase.auth();
const calendarsRef = db.collection("calendars");
const rowsRef = db.collection("rows");
const cardsRef = db.collection("cards");

export { calendarsRef, rowsRef, cardsRef, firebaseAuth };
