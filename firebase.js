const firebase = require("firebase/app");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7htzLb18d9G0E41cDLcgjZtK5vWVD-xc",
  authDomain: "fakenewz-47c58.firebaseapp.com",
  projectId: "fakenewz-47c58",
  storageBucket: "fakenewz-47c58.appspot.com",
  messagingSenderId: "1087331864514",
  appId: "1:1087331864514:web:3701e237291bddc9ef105b"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

module.exports = app;