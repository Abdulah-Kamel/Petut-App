import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function useDoctorStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchStatus = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setStatus(null);
        setLoading(false);
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStatus(docSnap.data().status);
      } else {
        setStatus(null);
      }
      setLoading(false);
    };

    fetchStatus();
  }, []);

  return { status, loading };
}
