import { db } from './firebase';

const getFirestore = (userId, date) => db.collection(userId).doc(date).get();

const setFirestore = (userId, date, data) => db.collection(userId).doc(date).set(data);


export {
  getFirestore,
  setFirestore,
};
