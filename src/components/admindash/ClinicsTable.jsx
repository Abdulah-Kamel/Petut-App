/* eslint-disable react-hooks/rules-of-hooks */
import { Fragment, useEffect } from 'react'
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import EditClinicModal from '../EditClinicModal';
import { BiSearchAlt2 } from "react-icons/bi";
import ConfirmModal from '../ConfirmModal';

import { FaEye } from "react-icons/fa";
import { BeatLoader } from 'react-spinners';
import ViewClinicModal from './ViewClinicModal';
import { useState } from 'react';

export default function ClinicsTable({ clinics, fetchClinics, onDelete, loading }) {


    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedClinicId, setSelectedClinicId] = useState(null);


    useEffect(() => {
        fetchClinics();
    }, []);

    // filter clinics by name, email, or specialization
    const filterClinics = clinics.filter(clinic => {
        const nameMatch = (clinic.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (clinic.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        // const specializationMatch = (clinic.specialization || '').toLowerCase().includes(searchTerm.toLowerCase());
        const doctorMatch = (clinic.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === 'all' || clinic.status === statusFilter;
        return (nameMatch || emailMatch || doctorMatch) && statusMatch;
    })
    return (
        <Fragment>


            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="search-box w-50 position-relative">
                    <input
                        className="form-control pe-5"
                        type="text"
                        placeholder="Search by name, email, or responsible doctor"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <BiSearchAlt2
                        size={20}
                        className="position-absolute"
                        style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', color: '#888' }}
                    />
                </div>
                <select className="form-select w-25" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all" >All</option>
                    <option value="active" >active</option>
                    <option value="inactive" >inactive</option>
                </select>
            </div>
            {loading ? <h3 className='text-center mt-5'><BeatLoader color='#D9A741' /></h3> : clinics?.length === 0 ? <h3 className='text-center mt-5 '>No clinics found</h3> : filterClinics.length === 0 ? (<h3 className='text-center mt-5'>No clinics match found</h3>) : (

                <div className="patient-table mt-4 mb-5 bg-white shadow rounded w-100" style={{ maxHeight: '395px', overflowY: 'auto' }}>
                    <table className="table">
                        <thead className="table-light py-3  position-sticky top-0">
                            <tr className="">
                                <th className="px-4 py-3">Clinic Name</th>
                                <th className="px-4 py-3">Address</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterClinics.map((clinic) => (
                                <tr key={clinic.id}>
                                    <td className="px-4 py-3">{clinic.name || clinic.clinicName}</td>
                                    <td className="px-4 py-3">{clinic.governorate}</td>
                                    <td className="px-4 py-3">{clinic.phone}</td>
                                    <td className="px-4 py-3">{clinic.price}</td>
                                    <td className="px-4 py-3"><span style={{ color: 'white', backgroundColor: clinic.status === 'active' ? '#28a745  ' : '#6c757d   ', fontSize: '14px' }} className='px-3 py-1 rounded rounded-5 '>{clinic.status}</span></td>
                                    <td className="px-4 py-3 d-flex align-items-center gap-2">

                                        <button type="button" className="btn border-0 p-0" data-bs-toggle="modal" data-bs-target={`#viewclinic-${clinic.id}`}>
                                            <FaEye cursor={"pointer"} size={20} className='mb-1' />
                                        </button>
                                        <ViewClinicModal clinic={clinic} modalId={clinic.id} />
                                        <button type="button" className="btn border-0 p-0" data-bs-toggle="modal" data-bs-target={`#editclinic-${clinic.id}`} >
                                            <TbEdit size={20} className='mb-1' />
                                        </button>
                                        <EditClinicModal clinic={clinic} modalId={clinic.id} />
                                        <MdDelete cursor={"pointer"} size={20} className='text-danger' onClick={() => {
                                            setShowConfirm(true);
                                            setSelectedClinicId(clinic.id);
                                        }} />
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    {showConfirm && (
                        <ConfirmModal onDelete={onDelete} setShowConfirm={setShowConfirm} selectedId={selectedClinicId} whatDelete={"clinic"} />
                    )}
                </div>
            )
            }
        </Fragment>
    )
}
