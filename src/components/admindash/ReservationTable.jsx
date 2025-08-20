import React, { Fragment, useEffect, useState } from 'react'
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import EditReservation from './EditReservation';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { toast } from 'react-toastify';
import { BiSearchAlt2 } from "react-icons/bi";
import { BeatLoader } from 'react-spinners';
import { FaEye } from "react-icons/fa";
import ViewBookingModal from '../ViewBookingModal.jsx';
import ConfirmModal from '../ConfirmModal.jsx';



export default function ReservationTable() {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBookingId, setselectedBookingId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);



    const [loading, setLoading] = useState(false);

    // Format التاريخ (DD/MM/YYYY)
    const formatDateForDisplay = (date) => {
        if (!date) return "";
        const d = date.toDate ? date.toDate() : new Date(date);
        const day = d.getDate().toString().padStart(2, "0");
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Format الوقت (12 ساعة AM/PM)
    const formatTimeForDisplay = (time) => {
        if (!time) return "";
        let [hours, minutes] = time.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")} ${ampm}`;
    };

    const getBookings = async () => {
        setLoading(true);
        try {
            const bookingsRef = collection(db, 'bookings');
            const querySnapshot = await getDocs(bookingsRef);
            const bookingsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBookings(bookingsData);
        } catch (error) {
            toast.error("Failed to fetch bookings, error:" + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }
    //get bookings from firestore
    useEffect(() => {
        getBookings();
    }, [])
    // update booking status
    const handleStatusChange = async (e, book) => {
        const newStatus = e.target.value;

        try {
            const bookingRef = doc(db, 'bookings', book.id);
            await updateDoc(bookingRef, { status: newStatus });
            toast.success('Status updated successfully', { autoClose: 3000 });
            setBookings(prev => prev.map(b => b.id === book.id ? { ...b, status: newStatus } : b));
        } catch (error) {
            toast.error('Failed to update status: ' + error.message, { autoClose: 3000 });
        }
    };
    // filter bookings by name, email
    const filterBookings = bookings.filter(book => {
        const nameMatch = (book.userName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === 'all' || book.status === statusFilter;
        return (nameMatch) && statusMatch;
    })

    // delete booking from firestore
    const handleDeleteBooking = async (bookingId) => {
        try {
            await deleteDoc(doc(db, 'bookings', bookingId));
            setBookings(bookings => bookings.filter(booking => booking.id != bookingId))
            await getBookings();
            toast.success('Booking deleted successfully', { autoClose: 3000 });
        } catch (err) {
            toast.error("Failed to delete booking, error:" + err.message, { autoClose: 3000 });
        } finally {
            setShowConfirm(false);
        }
    }


    return (
        <Fragment>


            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="search-box position-relative" style={{ width: '40%' }}>
                    <input
                        className="form-control pe-5"
                        type="text"
                        placeholder="Search by name, email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <BiSearchAlt2
                        size={20}
                        className="position-absolute"
                        style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', color: '#888' }}
                    />
                </div>

                <select className="form-select w-25" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} >
                    <option value="all" >All</option>
                    <option value="booked" >booked</option>
                    <option value="completed" >completed</option>
                </select>
            </div>
            <div className="bookings-table mt-4 bg-white shadow rounded w-100">
                {loading ? (<h3 className='text-center mt-5'><BeatLoader color='#D9A741' /></h3>) : bookings.length === 0 ? (<h3 className='text-center py-3'>No Bookings found</h3>) : (
                    <>
                        <div className="patient-table mt-4 bg-white shadow rounded w-100 my-5" style={{ maxHeight: '395px', overflowY: 'auto' }} >

                            <table className="table">
                                <thead className="table-light py-3 position-sticky top-0 z-10">
                                    <tr className="">
                                        <th className="px-4 py-3 align-middle">Client</th>
                                        <th className="px-4 py-3 align-middle">Phone</th>
                                        <th className="px-4 py-3 align-middle">Doctor</th>
                                        <th className="px-4 py-3 align-middle">Clinic</th>
                                        <th className="px-4 py-3 align-middle">Address</th>
                                        <th className="px-4 py-3 align-middle">Date</th>
                                        <th className="px-4 py-3 align-middle">Time</th>
                                        <th className="px-4 py-3 align-middle">Status</th>
                                        <th className="px-4 py-3 align-middle">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterBookings.map((book) => (
                                        <tr key={book.id}>
                                            <td className="px-4 py-3 align-middle">{book.userName}</td>
                                            <td className="px-4 py-3 align-middle">{book.customerPhone}</td>
                                            <td className="px-4 py-3 align-middle">{book.doctorName}</td>
                                            <td className="px-4 py-3 align-middle">{book.clinicName}</td>
                                            <td className="px-4 py-3 align-middle">{book.clinicLocation}</td>
                                            <td className="px-4 py-3 align-middle">{formatDateForDisplay(book.date)}</td>
                                            <td className="px-4 py-3 align-middle">{book.time}</td>
                                            <td className="px-4 py-3 align-middle">
                                                <select name="status" id="status" className='form-select ' value={book.status} onChange={(e) => handleStatusChange(e, book)}>
                                                    <option value="booked">Booked</option>
                                                    <option value="completed" >Done</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 align-middle">
                                                <div className="d-flex justify-content-start align-items-center gap-2">
                                                    <button type="button" className="btn border-0 p-0" data-bs-toggle="modal" data-bs-target={`#viewbooking-${book.id}`}>
                                                        <FaEye cursor={"pointer"} size={20} className="table-action-icon" />
                                                    </button>
                                                    <ViewBookingModal book={book} modalId={book.id} />
                                                    <button type="button" className="btn border-0 p-0" data-bs-toggle="modal" data-bs-target={`#editbooking-${book.id}`} >
                                                        <TbEdit size={20} className='table-action-icon' />
                                                    </button>
                                                    <EditReservation book={book} setBookings={setBookings} modalId={book.id} />
                                                    <button type="button" className="btn border-0 p-0" >
                                                        <MdDelete cursor={"pointer"} size={25} className='text-danger' data-bs-toggle="modal" data-bs-target="#confirmModal"
                                                            onClick={() => {
                                                                setShowConfirm(true);
                                                                setselectedBookingId(book.id);
                                                            }}
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    }

                                </tbody>
                            </table>
                            {showConfirm && (<ConfirmModal onDelete={() => handleDeleteBooking(selectedBookingId)} setShowConfirm={setShowConfirm} selectedId={selectedBookingId} whatDelete="booking" />)}

                        </div>
                    </>
                )
                }
            </div>

        </Fragment>
    )
}
