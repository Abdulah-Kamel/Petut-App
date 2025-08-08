import { Fragment, useState } from 'react'
import { FaUserDoctor } from "react-icons/fa6";
import { ImLocation2 } from "react-icons/im";
import { FaMobileAlt } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import { HiMiniUserGroup } from "react-icons/hi2";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import AppointmentsModal from './AppointmentsModal';
import Editclinicmodal from '../EditClinicModal';
import ConfirmModal from '../ConfirmModal';



//get clinics from firebase 
export default function Clinic({ clinic, onDelete }) {
    const { name, address, phone, email, status } = clinic

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedClinicId, setSelectedClinicId] = useState(null);



    return (
        <Fragment>
            <div className="clinic p-4 col-5" style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }} >
                <div className="clinic-header d-flex align-items-center justify-content-between">
                    <div className="left d-flex align-items-center gap-2">
                        <FaUserDoctor size={30} className='' />
                        <div className="title-clinic">
                            <h1 className='fw-bold fs-5 mb-0'>{name}</h1>
                        </div>
                    </div>
                    <div className="right">
                        <span style={{ color: 'white', backgroundColor: clinic.status === 'active' ? '#28a745  ' : '#6c757d   ', fontSize: '14px' }} className='px-3 py-1 rounded rounded-5 '>{status}</span>
                    </div>
                </div>
                <div className="clinic-body mt-3">
                    <div className="address d-flex align-items-center gap-2 mb-3">
                        <ImLocation2 />
                        <p className='mb-0'>{address?.governorate} - {address?.city}</p>
                    </div>
                    <div className="phone d-flex align-items-center gap-2 mb-3">
                        <FaMobileAlt />
                        <p className='mb-0'>{phone}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="email d-flex align-items-center gap-2 ">
                            <MdOutlineMail />
                            <p className='mb-0'>{email}</p>
                        </div>
                        <button
                            className="btn border-0 p-0 "
                            onClick={() => {
                                setSelectedClinicId(clinic.id);
                                setShowConfirm(true);
                            }}
                        >
                            <MdDelete cursor={"pointer"} size={25} className='text-danger' />
                        </button>
                    </div>
                    {showConfirm && (
                        <ConfirmModal onDelete={() => onDelete(selectedClinicId)} setShowConfirm={setShowConfirm} setSelectedClinicId={setSelectedClinicId} whatDelete={"clinic"} />
                    )}

                </div>
                <hr />
                <div className="options d-flex align-items-center justify-content-between">
                    <div className="option d-flex align-items-center justify-content-between gap-1">
                        <IoTimer />
                        <button type="button" className="btn border-0 p-0" data-bs-toggle="modal" data-bs-target={`#appointments-${clinic.id}`}>Appointments</button>
                        <AppointmentsModal clinic={clinic} modalId={clinic.id}  />
                    </div>
                    <div className="option d-flex align-items-center justify-content-between gap-1">
                        <HiMiniUserGroup />
                        <button type="button" className="btn border-0 p-0">patients</button>

                    </div>
                    <div className="option d-flex align-items-center justify-content-between gap-1">
                        
                        <button type="button" className="btn border-0 p-0 d-flex align-items-center gap-1" data-bs-toggle="modal" data-bs-target={`#editclinic-${clinic.id}`}><TbEdit />Edit data</button>
                        <Editclinicmodal clinic={clinic} modalId={clinic.id} />
                    </div>

                </div>
            </div>
        </Fragment>
    )
}


