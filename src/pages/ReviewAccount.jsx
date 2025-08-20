import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BeatLoader } from 'react-spinners';
import style from 'dom-helpers/esm/css';

export default function ReviewAccount() {
    const [status, setStatus] = useState(null); // pending, approved, rejected
    const [loading, setLoading] = useState(true);
    const [justApproved, setJustApproved] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        let unsubscribeDoc = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid);

                unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const currentStatus = docSnap.data().status;

                        // حالة الموافقة لسه جاية دلوقتي
                        if (currentStatus === 'approved' && status !== 'approved') {
                            setJustApproved(true);
                        } else {
                            setJustApproved(false);
                        }

                        setStatus(currentStatus);
                    }
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        // منع الرجوع للخلف
        const handlePopState = () => window.history.go(1);
        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            unsubscribeAuth();
            if (unsubscribeDoc) unsubscribeDoc();
            window.removeEventListener("popstate", handlePopState);
        };
    }, [status]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl"><BeatLoader color="#D9A741" /></h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            {status === 'pending' && (
                <>
                    <h2 className="text-2xl font-bold" style={{ color: "#FF985E" }}>
                        Your account is under review ⏳
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Your request will be reviewed by the administration soon.
                    </p>
                    <Link
                        to="#"
                        className="inline-block px-8 py-3 mt-5 text-base font-medium text-white btn-primary-app rounded-md opacity-50 cursor-not-allowed text-decoration-none"
                    >
                        Open Dashboard
                    </Link>
                </>
            )}

            {/* {status === 'approved' && justApproved && (
                <>
                    <h2 className="text-2xl font-bold" style={{ color: "#FF985E" }}>🎉 Congratulations!</h2>
                    <p className="mt-2 text-gray-700">
                        Your account has been approved.<br />Welcome to the Doctor Dashboard 👨‍⚕️
                    </p>
                    <button
                        onClick={() => navigate("/doctor-dashboard")}
                        className="mt-4 btn-primary-app text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
                    >
                        Open Dashboard
                    </button>
                </>
            )} */}

            {status === 'approved' && !justApproved && (
                <>
                    <h2 className="text-2xl font-bold" style={{ color: "#FF985E" }}> Congratulations Your Account Approved 🎉</h2>
                    <p className="mt-2 text-gray-700">
                        Welcome back! You can now access your Doctor Dashboard 👨‍⚕️
                    </p>
                    <button
                        onClick={() => navigate("/doctor-dashboard")}
                        className="mt-4 btn-primary-app text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
                    >
                        Open Dashboard
                    </button>
                </>
            )}

            {status === 'rejected' && (
                <>
                    <h2 className="text-2xl font-bold " style={{ color: "#FF985E" }}>Request Rejected</h2>
                    <p className="mt-2 text-gray-700">
                        We’re sorry, your account request has been rejected.<br />
                        If you believe this is a mistake, please contact support.
                    </p>
                    <button
                        onClick={() => navigate("/support")}
                        className="mt-4 btn-primary-app text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
                    >
                        Contact Support
                    </button>
                </>
            )}
        </div>
    );
}
