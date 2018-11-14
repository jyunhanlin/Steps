import firebase from 'firebase/app';
import { auth } from './firebase';


const signup = (email, password) =>
  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() =>
    auth.createUserWithEmailAndPassword(email, password));

const signin = (email, password) => auth.signInWithEmailAndPassword(email, password);

const signout = () => auth.signOut();

const checkAuthStateChanged = cb => auth.onAuthStateChanged(cb);

const forgotPassword = email => auth.sendPasswordResetEmail(email);


export {
  signin,
  signup,
  signout,
  checkAuthStateChanged,
  forgotPassword,
};
