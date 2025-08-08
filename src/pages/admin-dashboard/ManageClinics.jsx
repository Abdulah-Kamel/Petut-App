import React, { Fragment, useEffect, useState } from 'react'
import Statistic from '../../components/admindash/Statistic.jsx'
import { FaUserDoctor } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

import { RiAddLine } from "react-icons/ri";
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.js';

import { BeatLoader } from 'react-spinners';
import ClinicsTable from '../../components/admindash/ClinicsTable';
import { toast } from 'react-toastify';
import { FaEye } from "react-icons/fa";
import AddClinicModal from '../../components/AddClinicModal';



export default function ManageClinics() {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(false);

    const statistics = [
        { title: 'Total clinics', count: '100', icon: <FaClinicMedical size={40} /> },
        { title: 'Active doctors', count: '100', icon: <FaUserDoctor size={40} /> },
        { title: 'Total Clients', count: '100', icon: <FaUsers size={40} /> },
        { title: 'Total Reservations', count: '100', icon: <FaCalendarAlt size={40} /> },
    ]
    //get clinics from firestore
    const fetchClinics = async () => {
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
            // window.location.reload();
        } catch (error) {
            toast.error("Failed to delete clinic, error:" + error.message, { autoClose: 3000 });
        }
    }
    return (
        <Fragment>
            <div className='container-fluid mt-4'>
                <div className=''>
                    <h1>Clinic management</h1>
                    <p className=''>Managing all clinics and responsible doctors</p>
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

                <ClinicsTable clinics={clinics} fetchClinics={fetchClinics} onDelete={handleDeleteClinic} loading={loading} setLoading={setLoading} />
            </div>
        </Fragment>
    )
}
