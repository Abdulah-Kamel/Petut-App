import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { Fragment, useEffect, useState } from 'react'
import { db } from '../../firebase.js';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import ConfirmModal from '../ConfirmModal';
import { MdDelete } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import EditAdminModal from './EditAdminModal';
import { FaEye } from 'react-icons/fa';
import ViewAdminModal from './ViewAdminModal.jsx';

export default function AdminsTable({ admins, setAdmins, fetchAdmins, loading }) {

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);


    // get admins from firestore
    useEffect(() => {
        fetchAdmins();
    }, []);

    // delete admin from firestore
    const handleDeleteAdmin = async (adminId) => {
        try {
            await deleteDoc(doc(db, 'users', adminId));
            setAdmins(admins => admins.filter(admin => admin.id !== adminId))
            toast.success('Admin deleted successfully', { autoClose: 3000 });
        } catch (err) {
            toast.error("Failed to delete admin, error:" + err.message, { autoClose: 3000 });
        }
    }

    return (
        <Fragment>


            {loading ? <h3 className='text-center mt-5'><BeatLoader color='#D9A741' /></h3> : admins?.length === 0 ? <h3 className='text-center mt-5'>No Admins found</h3> : (


                <div className="admin-table mt-4 bg-white shadow rounded w-100" style={{ maxHeight: '395px', overflowY: 'auto' }} >
                    <table className="table">
                        <thead className="table-light py-3  position-sticky top-0">
                            <tr className="">
                                <th className="px-4 py-3">Full Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(admins) && admins.map((admin) => (
                                <tr key={admin.id}>
                                    <td className="px-4 py-3">{admin?.fullName || 'N/A'}</td>
                                    <td className="px-4 py-3">{admin?.email || 'N/A'}</td>
                                    <td className="px-4 py-3">{admin?.phone || 'N/A'}</td>

                                    <td className="px-4 py-3 d-flex align-items-center gap-2 ">
                                        <button type="button" className="btn border-0 p-0" data-bs-toggle="modal" data-bs-target={`#viewadmin-${admin.id}`}>
                                            <FaEye cursor={"pointer"} />
                                        </button>
                                        <ViewAdminModal admin={admin}  modalId={admin.id} />
                                        <button type="button" className="btn border-0 p-0" data-bs-toggle="modal" data-bs-target={`#editadmin-${admin.id}`}>
                                            <TbEdit className='' cursor={"pointer"} size={20} />
                                        </button>
                                        <EditAdminModal admin={admin} admins={admins} setAdmins={setAdmins} modalId={admin.id} />

                                        <button type="button" className="btn border-0 p-0" >
                                            <MdDelete cursor={"pointer"} size={20} className='text-danger'
                                                onClick={() => {
                                                    setShowConfirm(true);
                                                    setSelectedAdminId(admin.id);
                                                }}
                                            />
                                        </button>

                                    </td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                    {showConfirm && (<ConfirmModal onDelete={() => handleDeleteAdmin(selectedAdminId)} setShowConfirm={setShowConfirm} selectedId={selectedAdminId} whatDelete="Admin" />)}
                </div>

            )


            }

        </Fragment>
    )
}
