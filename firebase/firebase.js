const firebase = require('firebase/app').default;
require('firebase/auth');
require('firebase/database');

// ADD THESE VALUES TO .ENV AND IMPORT FROM THERE
var firebaseConfig = {
    apiKey: "AIzaSyAYdzESBtGAnKFd1oDt9ef1nOuV4Ylw2qc",
    authDomain: "testing-f5177.firebaseapp.com",
    projectId: "testing-f5177",
    storageBucket: "testing-f5177.appspot.com",
    messagingSenderId: "677930758495",
    appId: "1:677930758495:web:890c78e53fca0ba46e46ea"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);