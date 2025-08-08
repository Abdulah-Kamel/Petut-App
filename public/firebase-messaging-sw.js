
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB6pr6a6y63LvKpauCkonCqyV66WAeJEeg",
  authDomain: "petut-55f40.firebaseapp.com",
  projectId: "petut-55f40",
  storageBucket: "petut-55f40.appspot.com",
  messagingSenderId: "724593819082",
  appId: "1:724593819082:web:7d5ab9881bc9de39c8a333",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
