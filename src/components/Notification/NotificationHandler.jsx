import { useEffect } from "react";
import { messaging, getToken, onMessage } from "../../firebase";
import { auth, db } from "../../firebase";
import { doc, setDoc,getDoc } from "firebase/firestore";

const vapidKey =
  "BJejSjl-UmNNovakxHCiW1znkKEgMMrOyIdFDewJkEFNCaM6t4fBKYGm8Ct_fWKGVQmMDJpSp-vEtgSXVgjLMck";


function NotificationHandler() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(" Service Worker Registered");

          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              getToken(messaging, {
                vapidKey,
                serviceWorkerRegistration: registration,
              })
                .then(async (currentToken) => {
                  if (currentToken) {
                    console.log("FCM Token:", currentToken);
                    if (auth.currentUser) {
                      const uid = auth.currentUser.uid;
                      const userDocRef = doc(db, "users", uid);
                      const userDoc = await getDoc(userDocRef);

                      if (userDoc.exists()) {
                        await setDoc(
                          userDocRef,
                          { fcmToken: currentToken },
                          { merge: true }
                        );
                        console.log("FCM token saved to Firestore");
                      } else {
                        console.log("User document does not exist yet, skipping FCM token save.");
                      }
                    }
                  } else {
                    console.log("مفيش توكن.");
                  }
                })
                .catch((err) => {
                  console.error(" خطأ أثناء جلب التوكن:", err);
                });
            }
          });
        });
    }

    onMessage(messaging, async (payload) => {
      console.log("📩 إشعار وصلك:", payload);

      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
        });
      }

      // حفظ الإشعار في Firestore
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        const newNotification = {
          id: Date.now().toString(),
          title: payload.notification.title || "",
          body: payload.notification.body || "",
          timestamp: Date.now(),
          read: false,
        };

        if (userSnap.exists()) {
          const data = userSnap.data();
          const existingNotifications = data.notifications || [];

          const updatedNotifications = [
            newNotification,
            ...existingNotifications,
          ].slice(0, 20); 

          await setDoc(
            userRef,
            {
              notifications: updatedNotifications,
            },
            { merge: true }
          );

          console.log("🔔 تم حفظ الإشعار في Firestore");
        }
      }
    });

  }, []);

  return null;
}

export default NotificationHandler;
