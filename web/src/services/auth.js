import { auth } from './firebase';


const signup = (email, password) => auth.createUserWithEmailAndPassword(email, password);

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
