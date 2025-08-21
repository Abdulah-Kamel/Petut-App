import { useEffect, useState, useRef } from "react";
const Notification = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [permission, setPermission] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const initRef = useRef(false);
  useEffect(() => {
    // منع التهيئة المضاعفة باستخدام ref
    if (initRef.current) {
      return;
    }
    initRef.current = true;

    const initializeOneSignal = () => {
      try {
        // التأكد من وجود OneSignal
        if (typeof window.OneSignal === "undefined") {
          throw new Error("OneSignal SDK غير محمل - أضف script في index.html");
        }

        // استخدام OneSignalDeferred للتجنب مشكلة التهيئة المضاعفة
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async function (OneSignal) {
          try {
            console.log("🚀 بدء تهيئة OneSignal باستخدام Deferred...");

            await OneSignal.init({
              appId: "0f5304b0-aea7-4f4a-8eb3-0e715915a563",
              safari_web_id: "",
              notifyButton: {
                enable: true,
              },
              allowLocalhostAsSecureOrigin: true,
            });

            console.log("✅ OneSignal تم تهيئته بنجاح");
            setIsInitialized(true);

            // طلب الإذن
            const permissionResult =
              await OneSignal.Notifications.requestPermission();
            console.log("🔔 إذن الإشعارات:", permissionResult);
            setPermission(permissionResult);

            // الحصول على User ID
            let userIdResult = null;
            try {
              if (OneSignal.User && OneSignal.User.PushSubscription) {
                userIdResult = await OneSignal.User.PushSubscription.getId();
              }
            } catch (userIdError) {
              console.log("⚠️ User ID غير متوفر بعد");
            }

            console.log("🆔 معرف المستخدم:", userIdResult);
            setUserId(userIdResult);

            // إعداد مستمعات الأحداث
            OneSignal.Notifications.addEventListener("click", (event) => {
              console.log("👆 تم النقر على الإشعار:", event);
            });

            OneSignal.Notifications.addEventListener(
              "foregroundWillDisplay",
              (event) => {
                console.log("📱 إشعار في المقدمة:", event);
              }
            );
          } catch (err) {
            console.error("❌ خطأ في تهيئة OneSignal:", err);
            setError(err.message);
          }
        });
      } catch (err) {
        console.error("❌ خطأ عام:", err);
        setError(err.message);
      }
    };

    initializeOneSignal();

    // Cleanup function
    return () => {
      // لا نحتاج cleanup للـ OneSignal لأنه global
    };
  }, []); // Empty dependency array

  // دالة اختبار الإشعارات
  const sendTestNotification = async () => {
    if (!isInitialized) {
      alert("OneSignal غير مهيأ بعد");
      return;
    }

    try {
      if (permission !== "granted") {
        alert("يجب منح إذن الإشعارات أولاً!");

        // محاولة طلب الإذن مرة أخرى
        const newPermission =
          await window.OneSignal.Notifications.requestPermission();
        setPermission(newPermission);

        if (newPermission !== "granted") {
          return;
        }
      }

      // الحصول على User ID الحالي
      let currentUserId = userId;
      if (!currentUserId && window.OneSignal.User?.PushSubscription) {
        try {
          currentUserId = await window.OneSignal.User.PushSubscription.getId();
          setUserId(currentUserId);
        } catch (err) {
          console.log("لم يتم العثور على User ID");
        }
      }

      if (currentUserId) {
        console.log("✅ جاهز لاستقبال الإشعارات! User ID:", currentUserId);
        alert(
          `الإشعارات جاهزة! ✅\nUser ID: ${currentUserId}\n\nيمكنك الآن إرسال إشعار من OneSignal Dashboard`
        );
      } else {
        alert("لم يتم العثور على معرف المستخدم. تأكد من منح إذن الإشعارات.");
      }
    } catch (err) {
      console.error("خطأ في اختبار الإشعار:", err);
      alert("حدث خطأ: " + err.message);
    }
  };

  return null;
};

export default Notification;
