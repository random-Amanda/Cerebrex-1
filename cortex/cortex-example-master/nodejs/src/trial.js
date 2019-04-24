var firebase = require("firebase");

var firebaseConfig = {
    apiKey: "AIzaSyAxQ7xo6_YDwYLYHqjSgy4kVhcchM_25TM",
    authDomain: "cerebrex-c0a9a.firebaseapp.com",
    databaseURL: "https://cerebrex-c0a9a.firebaseio.com",
    projectId: "cerebrex-c0a9a",
    storageBucket: "cerebrex-c0a9a.appspot.com",
    messagingSenderId: "581559446579"
  };


firebase.initializeApp(firebaseConfig);

var database = firebase.database();



function writeUserData(userId, name) {
  firebase.database().ref('users/' + userId).set({
    username: name
  });
}

writeUserData(1,'m');