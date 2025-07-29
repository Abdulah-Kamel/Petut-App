import React, { Fragment, useEffect, useState } from 'react'
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import EditReservation from './EditReservation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { toast } from 'react-toastify';
import { BiSearchAlt2 } from "react-icons/bi";
export default function ReservationTable() {
    const [appointments, setAppointments] = useState([]);

    //get reservations from firestore
    useEffect(() => {
        const getAppointments = async () => {
            try {
                const appointmentsRef = collection(db, 'appointments');
                const querySnapshot = await getDocs(appointmentsRef);
                const appointmentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAppointments(appointmentsData);
            } catch (error) {
                toast.error("Failed to fetch reservations, error:" + error.message, { autoClose: 3000 });
            }
        }
        getAppointments();
    }, [])
    return (
        <Fragment>
            <div className="patient-table mt-4 bg-white shadow rounded w-100">

                {appointments.length === 0 ? <p className='text-center py-3'>No reservations found</p> :
                    <>
                        <div className="d-flex justify-content-between align-items-center my-3">
                            <div className="search-box position-relative" style={{ width: '40%' }}>
                                <input
                                    className="form-control pe-5"
                                    type="text"
                                    placeholder="Search by name, email, or specialization"


                                />
                                <BiSearchAlt2
                                    size={20}
                                    className="position-absolute"
                                    style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', color: '#888' }}
                                />
                            </div>
                            <select className="form-select w-25"  >
                                <option value="all" >All</option>
                                <option value="male" >male</option>
                                <option value="female" >female</option>
                            </select>
                            <select className="form-select w-25" >
                                <option value="all" >All</option>
                                <option value="active" >active</option>
                                <option value="inactive" >inactive</option>
                            </select>
                        </div>
                        <table className="table">
                            <thead className="table-light py-3">
                                <tr className="">
                                    <th className="px-4 py-3">Client</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Doctor</th>
                                    <th className="px-4 py-3">Clinic</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Time</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length > 0 ? appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td className="px-4 py-3">{appointment.clientName}</td>
                                        <td className="px-4 py-3">{appointment.clinicPhone}</td>
                                        <td className="px-4 py-3">{appointment.doctorName}</td>
                                        <td className="px-4 py-3">{appointment.clinicName}</td>
                                        <td className="px-4 py-3">{appointment.date}</td>
                                        <td className="px-4 py-3">{appointment.time}</td>
                                        <td className="px-4 py-3">{appointment.status}</td>
                                        <td className="px-4 py-3">
                                            <button type="button" className="btn border-0 p-0 me-2" data-bs-toggle="modal" data-bs-target="#editreservation" >
                                                <TbEdit size={20} className='' />
                                            </button>
                                            <EditReservation />
                                            <MdDelete cursor={"pointer"} size={20} className='text-danger' />
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No reservations found</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </>


                }
            </div>
        </Fragment>
    )
}
