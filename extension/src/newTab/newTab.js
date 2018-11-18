import dayjs from 'dayjs';
import { db } from '../services/firebase';
import * as authService from '../services/auth';


document.getElementById('test').innerText = 'what the~~~';
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
//   switch (request.message){
//       case "loadNewTab":
//           console.log(request.data);
//           //You have the object as request.data with tabUrl and tabHtml
//           break;
//   }
// });

const btn = document.getElementById('btn');
console.log(btn);

authService.checkAuthStateChanged((user) => {
  console.log(user);
  db.collection(user.uid).doc(dayjs().format('YYYY-MM-DD'))
    .onSnapshot((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());
      }
    }, (err) => {
      console.log(err);
    });
});
