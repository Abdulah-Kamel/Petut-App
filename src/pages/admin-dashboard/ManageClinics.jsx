import React, { Fragment, useEffect, useState } from 'react'
import { FaUserDoctor } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

import { RiAddLine } from "react-icons/ri";
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.js';

import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { FaEye } from "react-icons/fa";
import AddClinicModal from '../../components/AddClinicModal';
import logo from '../../assets/petut.png';
import Statistic from '../../components/admindash/Statistic';
import ClinicsTable from './../../components/admindash/ClinicsTable';


export default function ManageClinics() {
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [clients, setClients] = useState(0);
    const [Bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetchClinics();
        fetchDoctors();
        fetchClients();
        fetchBookings();
    }, []);
    const statistics = [
        { title: 'Total clinics', count: clinics.length, icon: <FaClinicMedical size={40} className="statistic-icon" /> },
        { title: 'Total doctors', count: doctors.length, icon: <FaUserDoctor size={40} className="statistic-icon" /> },
        { title: 'Total Clients', count: clients, icon: <FaUsers size={40} className="statistic-icon" /> },
        { title: 'Total Bookings', count: Bookings.length, icon: <FaCalendarAlt size={40} className="statistic-icon" /> },
    ]
    //get clinics from firestore
    const fetchClinics = async () => {
        // setLoading(true);
        try {
            const clinicsRef = collection(db, 'clinics');
            const clinicsSnapshot = await getDocs(clinicsRef);
            const clinicsData = clinicsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setClinics(clinicsData);
        } catch (error) {
            toast.error("Failed to fetch clinics, error:" + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }

    //Delele clinic from firebase
    const handleDeleteClinic = async (id) => {
        try {
            await deleteDoc(doc(db, 'clinics', id));
            setClinics(clinics => clinics.filter(clinic => clinic.id !== id))
            toast.success('Clinic deleted successfully', { autoClose: 3000 });
        } catch (error) {
            toast.error("Failed to delete clinic, error:" + error.message, { autoClose: 3000 });
        }
    }
    const fetchDoctors = async () => {

        const doctorsRef = collection(db, 'users');
        const q = query(doctorsRef, where('role', '==', 'doctor'));
        const doctorsSnapshot = await getDocs(q);
        setDoctors(doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    const fetchClients = async () => {

        const clientsRef = collection(db, 'bookings');
        // const q = query(clientsRef, where('role', '==', 'customer'));
        const clientsSnapshot = await getDocs(clientsRef);
        const userIds = clientsSnapshot.docs.map(doc => doc.data().userId);
        const uniqueClients = [...new Set(userIds)];

        // return uniqueClients.length;
        setClients(uniqueClients.length);
    };
    const fetchBookings = async () => {

        const bookingsRef = collection(db, 'bookings');
        // const q = query(doctorsRef, where('role', '==', 'customer'));
        const bookingsSnapshot = await getDocs(bookingsRef);
        setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    return (
        <Fragment>
            <div className='container-fluid mt-4'>
                <div className="d-flex justify-content-between">
                    <div className='left'>
                        <h1>Clinic management</h1>
                        <p className=''>Managing all clinics and responsible doctors</p>
                    </div>
                    <div className="right">
                        <img src={logo} width={'100px'} height={'100px'} alt="logo" />
                    </div>
                </div>
                <div className="statistics mt-5 pb-5 d-flex align-items-center justify-content-center gap-3 flex-wrap">
                    {statistics.map((statistic, index) => (
                        <Statistic key={index} title={statistic.title} count={statistic.count} icon={statistic.icon} />
                    ))}
                </div>
                <hr />
                <div className='d-flex align-items-center justify-content-end mt-4 pb-5' >
                    <button className='custom-button d-flex align-items-center fw-bold' data-bs-toggle="modal" data-bs-target="#addclinic" > <RiAddLine size={20} /> Add clinic</button>
                </div>
                <AddClinicModal clinics={clinics} setClinics={setClinics} fetchClinics={fetchClinics} setLoading={setLoading} />

                {loading ? (
                    <div className='d-flex align-items-center justify-content-center p-5'>
                        <BeatLoader color="#D9A741" size={20} />
                    </div>
                ) : clinics.length === 0 ? (<div className='d-flex align-items-center justify-content-center p-5'>No clinics found</div>) : (

                    <ClinicsTable clinics={clinics} setClinics={setClinics} fetchClinics={fetchClinics} onDelete={handleDeleteClinic} loading={loading} setLoading={setLoading} />
                )}
            </div>
        </Fragment>
    )
}
