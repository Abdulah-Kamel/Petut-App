import { doc, updateDoc } from 'firebase/firestore';
import React, { Fragment, useState } from 'react'
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';

export default function EditReservation({ book, modalId, setBookings }) {
    if (!book) return null;
    // convert 24-hour time to 12-hour time
    const convertTo12Hour = (time24) => {
        if (!time24) return '';
        let [hours, minutes] = time24.split(':');
        hours = parseInt(hours);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };
        // convert 12-hour time to 24-hour time
    const convertTo24Hour = (time12) => {
        if (!time12) return '';
        let [hourMin, period] = time12.split(' ');
        if (!period) return time12; // لو جاي أصلاً 24
        let [hours, minutes] = hourMin.split(':');
        hours = parseInt(hours);
        if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
        if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };
    // التاريخ للعرض
    const formatDateForDisplay = (date) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // التاريخ لحقل input
    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${d.getFullYear()}-${month}-${day}`;
    };

    const formatTimeForInput = (time) => {
        if (!time) return '';
        let [hourMin, period] = time.split(' ');
        if (!period) return time; // لو أصلاً بصيغة 24
        let [hours, minutes] = hourMin.split(':');
        hours = parseInt(hours);
        if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
        if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };
    const { time: defaultTime, date: defaultDate } = book;

    // const [time, setTime] = useState(formatTimeForInput(defaultTime));
    const [time, setTime] = useState(convertTo24Hour(defaultTime));
    const [date, setDate] = useState(formatDateForInput(defaultDate));
    const [notEditable, setNotEditable] = useState(true);
    const [loading, setLoading] = useState(false);

    // // الوقت للعرض بصيغة 12 ساعة
    // const formatTimeForDisplay = (time) => {
    //     if (!time) return '';

    //     if (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm')) {
    //         return time;
    //     }
    //     let [hours, minutes] = time.split(':');
    //     hours = parseInt(hours);
    //     const ampm = hours >= 12 ? 'PM' : 'AM';
    //     hours = hours % 12 || 12;
    //     return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    // };



    const handleSave = async () => {
        if (!date || !time) {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return;
        }

        setLoading(true);
        try {
            const bookingRef = doc(db, 'bookings', book.id);
            await updateDoc(bookingRef, {
                date,
                time: convertTo12Hour(time)
            });
            toast.success('Booking updated successfully!', { autoClose: 3000 });
            setNotEditable(true);
            const modalEl = document.getElementById(`editbooking-${modalId}`);
            if (modalEl) {
                modalEl.classList.remove('show');
                modalEl.style.display = 'none';
                document.body.classList.remove('modal-open');

                // إزالة أي backdrop موجود
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach((b) => b.remove());

                setBookings(prev =>
                    prev.map(b => (b.id === book.id ? { ...b, date, time } : b))
                );
            }
        } catch (error) {
            toast.error('Failed to update booking: ' + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const resetFields = () => {
        setDate(formatDateForInput(defaultDate));
        setTime(formatTimeForInput(defaultTime));
    };



    return (
        <Fragment>
            <div className="modal fade" id={`editbooking-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                Edit Reservation Info
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Current Date:</strong> {formatDateForDisplay(defaultDate)}</p>
                            <p><strong>Current Time:</strong> {convertTo12Hour(defaultTime)}</p>
                            <form>
                                <div className="date d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="date" className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-control w-75"
                                        id="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        disabled={notEditable}
                                    />
                                </div>
                                <div className="time d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="time" className="form-label">Time</label>
                                    <input
                                        type="time"
                                        className="form-control w-75"
                                        id="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        disabled={notEditable}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer d-flex gap-3">
                            {!notEditable ? (
                                <div className="d-flex gap-3 w-100 justify-content-end">
                                    <button
                                        type="button"
                                        className="btn text-white bg-danger w-25"
                                        onClick={() => {
                                            resetFields();
                                            setNotEditable(true);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="custom-button w-25 d-flex align-items-center justify-content-center"
                                        onClick={handleSave}
                                        disabled={notEditable || loading}
                                    >
                                        {loading ? <BeatLoader size={10} color="#fff" /> : "Save"}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="custom-button w-25 text-white bg-danger"
                                        data-bs-dismiss="modal"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="custom-button w-25"
                                        onClick={() => setNotEditable(false)}
                                    >
                                        Edit Booking
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
