import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCKwmgwS8VVNxyafvYaGjZygj_oxaLZcP0',
  authDomain: 'steps-882cd.firebaseapp.com',
  databaseURL: 'https://steps-882cd.firebaseio.com',
  projectId: 'steps-882cd',
  storageBucket: 'steps-882cd.appspot.com',
  messagingSenderId: '423350737736',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

const signup = (email, password) => auth.createUserWithEmailAndPassword(email, password);

const signin = (email, password) =>
  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => auth.signInWithEmailAndPassword(email, password));

const signout = () => auth.signOut();

const checkAuthStateChanged = cb => auth.onAuthStateChanged(cb);


export {
  auth,
  signin,
  signup,
  signout,
  checkAuthStateChanged,
};
