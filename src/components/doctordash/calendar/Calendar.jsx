import React, { Fragment, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../../firebase.js';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import logo from '../../../assets/petut.png';
import ViewClientBooking from '../VeiwClientBooking.jsx';

export default function Calendar() {

    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    //get booking data from firebase
    //
    useEffect(() => {
        const fetchAllBookings = async () => {
            const currentUser = auth.currentUser;
            console.log(currentUser);

            if (!currentUser) return; // لو المستخدم مش مسجل دخول
            try {
                const q = query(
                    collection(db, "bookings"),
                    where("doctorId", "==", currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                const bookingsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log(bookingsData);

                setBookings(bookingsData);
            } catch (error) {
                toast.error("Failed to fetch bookings, error:" + error.message, { autoClose: 3000 });
            } finally {
                setLoading(false);
            }
        }
        fetchAllBookings();

    }, []);

    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);
        setShowModal(true);
    };

    const calendarEvents = bookings.map(book => {
        let formattedDate = "";
        if (book.date?.toDate) {
            formattedDate = book.date.toDate().toISOString().split("T")[0];
        }
        else if (typeof book.date === 'string') {
            formattedDate = new Date(book.date).toISOString().split("T")[0];
        }

        return {
            id: book.id,
            title: book.clinicName,
            date: formattedDate,
        };
    });
    const selectedDayBookings = bookings.filter(book => {
        const bookDate = book.date?.toDate ? book.date.toDate().toISOString().split("T")[0] : new Date(book.date).toISOString().split("T")[0];
        return bookDate === selectedDate;

    });


    return (
        <Fragment>

            <div className="container my-4">
                {loading ? (
                    <h3 className='text-center mt-5'><BeatLoader color="#D9A741" /></h3>) : (
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            right: 'prev today next',
                            left: 'title',
                            // left: 'dayGridMonth,dayGridWeek'
                        }}
                        dateClick={handleDateClick}
                        events={calendarEvents}
                        height={530}
                        width="100%"
                    />
                )
                }
            </div>

            {showModal && (
                <>
                    <div className="modal modal-lg large show fade d-block" tabIndex={-1} role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                                    <h5 className="modal-title">Day data: {selectedDate}</h5>
                                    <img src={logo} width="90" height="90" alt="logo" />
                                </div>

                                <div className="modal-body">
                                    {selectedDayBookings > 0 ? selectedDayBookings.map((book) => (
                                        <div className="d-flex align-items-start gap-5 " key={book.id}>
                                            <div className="left">
                                                <p>Client Name :</p>
                                                <p>Client Email :</p>
                                                <p>Client Phone :</p>
                                                <p>Clinic Name :</p>
                                                <p>Clinic Phone :</p>
                                                <p>Clinic Address :</p>
                                                <p>Doctor Name :</p>
                                                <p>Date :</p>
                                                <p>Time :</p>
                                                <p>Price :</p>
                                                <p>Status :</p>
                                                <p>Payment Method :</p>
                                            </div>
                                            <div className="right">
                                                <p>{book.userName || 'N/A'}</p>
                                                <p>{book.customerEmail || 'N/A'}</p>
                                                <p>{book.customerPhone || 'N/A'}</p>
                                                <p>{book.clinicName || 'N/A'}</p>
                                                <p>{book.clinicPhone || 'N/A'}</p>
                                                <p>{book.clinicLocation || 'N/A'}</p>
                                                <p>{book.doctorName || ''}</p>
                                                <p>{book.date?.toDate
                                                    ? book.date.toDate().toLocaleDateString('en-GB')
                                                    : book.date || ''}</p>
                                                <p>{book.time || ''}</p>
                                                <p>{book.price || ''} EGP</p>
                                                <p>{book.status || ''}</p>
                                                <p>{book.paymentMethod || ''}</p>
                                            </div>
                                        </div>
                                    ))
                                        : (
                                            <p>No data available for the selected day.</p>
                                        )
                                    }

                                    {/* {selectedDayBookings.length > 0 ? (
                                        <ul className=" p-0">
                                            {selectedDayBookings.map((item) => (
                                                <li key={item.id}>
                                                    
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (

                                        <p>No data available for the selected day.</p>
                                    )} */}
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}



        </Fragment>
    )
}
