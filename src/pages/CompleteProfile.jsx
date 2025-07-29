import { useSearchParams, useNavigate } from 'react-router-dom'
import {useEffect, useState} from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase'
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";
import CustomerForm from "../components/profile/CustomerForm.jsx";
import DoctorForm from "../components/profile/DoctorForm.jsx";

const CompleteProfile = () => {
    const [searchParams] = useSearchParams()
    const uid = searchParams.get('uid')
    const role = searchParams.get('role')
    const navigate = useNavigate()



    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)



    const loadingHandler = ()=>{
        setLoading(true);
        setError('');
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    if(loading){
        return <LoadingAnimation/>
    }

    useEffect(() => {
        console.log(role)
    }, []);
    if(role === "doctor")  return <DoctorForm/>
    if(role === "customer")  return <CustomerForm/>
}

export default CompleteProfile