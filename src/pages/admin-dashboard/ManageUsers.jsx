import { Fragment, useState } from 'react'
import { FaUsers } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";
import DoctorsTable from '../../components/admindash/DoctorsTable';
import { RiAddLine } from "react-icons/ri";
import Clienttable from '../../components/admindash/ClientsTable';
import AddClientModal from '../../components/admindash/AddClientModal';
import AddDoctorModal from '../../components/admindash/AddDoctorModal';
import AddAdminModal from '../../components/admindash/AddAdminModal';
import AdminsTable from '../../components/admindash/AdminsTable';
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../firebase.js";
import {toast} from "react-toastify";



export default function ManageUsers() {
    const [activeTab, setActiveTab] = useState('doctors');
    const [loading, setLoading] = useState(true);
    const fetchDoctors = async () => {
        try {
            const q = query(collection(db, "users"), where("role", "==", "doctor"));
            const querySnapshot = await getDocs(q);
            const doctorsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDoctors(doctorsData);
        } catch (error) {
            toast.error("Failed to fetch doctors, error:" + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };
    const [doctors, setDoctors] = useState([]);


    return (
        <Fragment>
            <div className='container-fluid mt-4'>
                <div className='mb-3'>
                    <h1>Users management</h1>
                    <p className=''>Manage all doctors and clients in the system</p>
                </div>
                <div style={{}}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
                        <button
                            onClick={() => setActiveTab('doctors')}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderBottom: activeTab === 'doctors' ? '3px solid #D9A741' : 'none',
                                background: 'transparent',
                                color: activeTab === 'doctors' ? '#D9A741' : '#333',
                                fontWeight: activeTab === 'doctors' ? 'bold' : 'normal'
                            }}
                            className='d-flex align-items-center'
                        >
                            <FaUserDoctor className='me-2' size={20} />
                            doctors
                        </button>

                        <button
                            onClick={() => setActiveTab('clients')}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderBottom: activeTab === 'clients' ? '3px solid #D9A741' : 'none',
                                background: 'transparent',
                                color: activeTab === 'clients' ? '#D9A741' : '#333',
                                fontWeight: activeTab === 'clients' ? 'bold' : 'normal'
                            }}
                            className='d-flex align-items-center'
                        >
                        <FaUsers className='me-2' size={20} />
                        clients
                        </button>
                        <button
                            onClick={() => setActiveTab('admins')}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderBottom: activeTab === 'admins' ? '3px solid #D9A741' : 'none',
                                background: 'transparent',
                                color: activeTab === 'admins' ? '#D9A741' : '#333',
                                fontWeight: activeTab === 'admins' ? 'bold' : 'normal'
                            }}
                            className='d-flex align-items-center'
                        >
                        <FaUsers className='me-2' size={20} />
                        Admins
                        </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <button className='custom-button d-flex align-items-center fw-bold'  data-bs-toggle="modal" data-bs-target={`#${activeTab === 'doctors' ? 'adddoctor' : activeTab === 'clients' ? 'addclient' : 'addadmin'}`} > <RiAddLine size={20} />{activeTab === 'doctors' ? 'Add doctor' : activeTab === 'clients' ? 'Add client' : 'Add admin'}</button>
                    </div>
                    {activeTab ==='doctors' ? <AddDoctorModal fetchDoctors={fetchDoctors} doctors={doctors} setDoctors={setDoctors} /> : activeTab === 'clients' ? <AddClientModal /> : <AddAdminModal />}
                    <div style={{ marginTop: '30px' }}>
                        {activeTab === 'doctors' && <DoctorsTable fetchDoctors={fetchDoctors} doctors={doctors} setDoctors={setDoctors} loading={loading} setLoading={setLoading}/>}
                        {activeTab === 'clients' && <Clienttable />}
                        {activeTab === 'admins' && <AdminsTable />}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
