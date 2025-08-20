// import { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { getAuth } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { BeatLoader } from 'react-spinners';


// export default function DoctorProtectedRoute({ children }) {
//     const [loading, setLoading] = useState(true);
//     const [isApproved, setIsApproved] = useState(false);
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const auth = getAuth();
//         const currentUser = auth.currentUser;
//         setUser(currentUser);

//         const fetchDoctorStatus = async () => {
//             if (currentUser) {
//                 try {
//                     const docRef = doc(db, "users", currentUser.uid);
//                     const docSnap = await getDoc(docRef);
//                     if (docSnap.exists()) {
//                         const status = docSnap.data().status;
//                         setIsApproved(status === "approved");
//                     }
//                 } catch (err) {
//                     console.error("Error fetching doctor status:", err);
//                 } finally {
//                     setLoading(false);
//                 }
//             } else {
//                 setLoading(false);
//             }
//         };

//         fetchDoctorStatus();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <BeatLoader color="#D9A741" size={15} />
//             </div>

//         )
//     };

//     if (!user) {
//         return <Navigate to="/login" replace />;
//     }

//     if (!isApproved) {
//         return <Navigate to="/pending-approval" replace />;
//     }

//     return children;
// }



// ProtectedRoute.jsx
import React, {useEffect} from "react";
import { Navigate } from "react-router-dom";
import useDoctorStatus from "../hooks/useDoctorStatus";

export default function ProtectedRoute({ children }) {
  const { status, loading } = useDoctorStatus();

  if (loading) return <p>Loading...</p>;

  if (status === "pending") return <Navigate to="/pending" replace />;
  if (status === "rejected") return <Navigate to="/rejected" replace />;
  if (status === "approved") return children;
  else {
  return <Navigate to="/login" replace />;
  }
}
