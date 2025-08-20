// useDoctorStatus.js
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function useDoctorStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsub = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (snapshot) => {
        if (snapshot.exists() && snapshot.data().role === "doctor") {
          setStatus(snapshot.data().status);
        }
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { status, loading };
}
