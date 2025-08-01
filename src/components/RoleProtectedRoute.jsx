import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import {db, getUserProfile} from "../firebase.js";
import { Navigate } from "react-router-dom";
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";
import {doc, getDoc} from "firebase/firestore";

const roles = {
    admin: "admin",
    customer: "customer",
    doctor: "doctor"
};

const RoleProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const getUserData = async () => {
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUser(userSnap.data());
                    console.log("User data found:", userSnap.data())
                } else {
                    console.log("No user data found");
                }
                setLoading(false);
            };
            getUserData();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    // Show loading animation if still loading user profile
    if (loading) {
        return <LoadingAnimation />;
    }



    // If user is logged in and has a specific role, redirect to the respective dashboard
    if (user?.role === roles.admin) {
        return <Navigate to="/admin-dashboard" />;
    }

    if (user?.role === roles.doctor) {
        return <Navigate to="/doctor-dashboard" />;
    }


        return children;
};

export default RoleProtectedRoute;
