import { Fragment, useEffect, useState } from 'react'
import { FaBars } from "react-icons/fa";
import { auth, db } from '../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FaBell } from "react-icons/fa6";

export default function HeaderDoctor({ toggleSidebar }) {

    const [doctorData, setDoctorData] = useState(null);

    //get doctor data from firebase
    useEffect(() => {
        console.log(doctorData)
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                const data = docSnap.data();
                if (data.role === 'doctor') {
                    setDoctorData(data);
                }
            }
        });

        return () => unsubscribe();
    }, []);
 
    return (
        <Fragment>
            <header className="header-dash">
                <nav className="navbar container-fluid background py-3 px-4 align-items-center position-fixed top-0 start-0 end-0 z-1 " style={{ height: '100px', borderBottom: '1px solid #D9A741' }}>
                    {/* <div className="">
                        <img src={logo} alt="logo" style={{ width: '80px', height: '80px'}} />
                    </div> */}
                    <div className="container-fluid me-0 flex-1 " >
                        <span className="navbar-brand mb-0 h1 d-flex align-items-center gap-3 fs-3"><FaBars size={30} onClick={toggleSidebar} cursor={"pointer"} />Dashboard</span>
                        <div className="d-flex align-items-center gap-2 text-white justify-content-between">
                            <FaBell size={20} cursor={"pointer"} color='#000' />
                            <span className="navbar-brand mb-0 fs-6 fw-bold">Welcome, Dr: {doctorData?.fullName}</span>
                            <img src={doctorData?.profileImage} alt="img-doctor" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        </div>
                    </div>
                </nav>
            </header>

        </Fragment>
    )
}
