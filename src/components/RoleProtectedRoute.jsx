import React, {useEffect, useState} from 'react';
import {useAuth} from "../context/AuthContext.jsx";
import {getUserProfile} from "../firebase.js";
import {Navigate} from "react-router-dom";
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";

const roles = {
    admin:"admin",
    customer:"customer",
    doctor:"doctor"
}

const RoleProtectedRoute = ({children}) => {
    const {currentUser} = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(currentUser){
            getUserProfile(currentUser.uid)
            .then((profile)=>{
                setUser(profile);
            })
            .finally(()=>{
                setLoading(false);
            });
        }else{
            setLoading(false);
        }
    },[currentUser])

    if(loading) {
        return <LoadingAnimation />;
    }

    if(!currentUser) return <Navigate to="/login" />;

    if(user?.role === roles.admin )return <Navigate to="/admin-dashboard" />;
    if(user?.role === roles.doctor )return <Navigate to="/doctor-dashboard" />;

    if(user?.role === roles.customer){
        return children;
    }

    return <Navigate to="/login" />;
};

export default RoleProtectedRoute;