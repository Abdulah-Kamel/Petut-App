import React, { Fragment, useEffect, useState } from 'react'
import { FaEye } from "react-icons/fa";
import VeiwClientBooking from './VeiwClientBooking';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { BiSearchAlt2 } from "react-icons/bi";
import { BeatLoader } from 'react-spinners';




export default function BookingsOneDoctor({ bookings, setBookings }) {

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [statusFilter, setStatusFilter] = useState('all');


    const handleStatusChange = async (bookingId, newStatus) => {
        setLoading(true);
        try {
            const bookRef = doc(db, "bookings", bookingId);
            await updateDoc(bookRef, { status: newStatus });
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            toast.success(`Booking status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status: " + error.message);
        }
    };

    const filterBookings = bookings.filter(booking => {
        const clinicNameMatch = (booking.clinicName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
        return (clinicNameMatch ) && statusMatch ;
    })
    return (
        <Fragment>


            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="search-box w-50 position-relative">
                    <input
                        className="form-control pe-5"
                        type="text"
                        placeholder="Search by Clinic Name or Doctor Name"
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
                    <option value="booked" >Booked</option>
                    <option value="completed" >Completed</option>
                </select>
            </div>

            {loading ? (<h3 className='text-center mt-5'><BeatLoader color="#D9A741" /></h3>) : bookings?.length === 0 ? (<h3 className='text-center mt-5'>No Bookings found </h3>) : (

                <div className="patient-table mt-4  bg-white shadow rounded w-100" style={{ maxHeight: '395px', overflowY: 'auto' }}>
                    <table className="table">
                        <thead className="table-light py-3  position-sticky top-0">
                            <tr className="">
                                <th className="px-4 py-3">clinicName</th>
                                <th className="px-4 py-3">clinicLocation</th>
                                <th className="px-4 py-3">clinicPhone</th>
                                <th className="px-4 py-3">Time</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-4 py-3">{booking?.clinicName || "-"}</td>
                                    <td className="px-4 py-3">{booking?.address || "-"}</td>
                                    <td className="px-4 py-3">{booking?.clinicPhone || "-"}</td>
                                    <td className="px-4 py-3">
                                        {booking?.date
                                            ? new Date(booking.date.seconds * 1000).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })
                                            : "-"}
                                    </td>

                                    <td className="px-4 py-3">{booking?.time || "-"}</td>
                                    <td className="px-4 py-3">{booking?.price || "-"}</td>
                                    <td className="px-4 py-3">
                                        <select className="form-select " aria-label="Default select example" value={booking?.status} onChange={(e) => handleStatusChange(booking.id, e.target.value)}>
                                            <option value="booked">booked</option>
                                            <option value="completed">completed</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button type="button" className="btn border-0 p-0 mb-1" data-bs-toggle="modal" data-bs-target={`#booking-${booking.id}`}>
                                            <FaEye cursor={"pointer"} />
                                        </button>
                                        <VeiwClientBooking booking={booking} bookingId={booking.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </Fragment>
    )
}
