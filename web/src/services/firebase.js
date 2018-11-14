import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-firestore';

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
const db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
db.settings(settings);

export {
  db,
  auth,
};
