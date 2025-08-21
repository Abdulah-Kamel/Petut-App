import React, { Fragment } from 'react'
import logo from '../../assets/petut.png'
export default function VeiwClientBooking({ booking, bookingId }) {



    return (
        <Fragment>
            <div className="modal fade" id={`booking-${booking.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between pe-0 py-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Booking Details</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />
                        </div>
                        <div className="modal-body ">
                            <div className="d-flex align-items-start gap-5">
                                <div className="left">
                                    <p>Address :</p>
                                    <p>ClinicName :</p>
                                    <p>Clinic Phone :</p>
                                    <p>Customer Email :</p>
                                    <p>Customer Phone :</p>
                                    <p>Date :</p>
                                    <p>Time :</p>
                                    <p>Doctor Name :</p>
                                    <p>Client Name :</p>
                                    <p>Payment Method :</p>
                                    <p>Price :</p>
                                    <p>Status :</p>

                                </div>
                                <div className="right ">
                                    <div className="">
                                        <p>{booking.address}</p>
                                        <p>{booking.clinicName}</p>
                                        <p>{booking.clinicPhone}</p>
                                        <p>{booking.customerEmail}</p>
                                        <p>{booking.customerPhone || 'N/A'}</p>
                                        <p>                                     {booking?.date
                                            ? new Date(booking.date.seconds * 1000).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })
                                            : "-"}</p>
                                        <p>{booking.time}</p>
                                        <p>{booking.doctorName}</p>
                                        <p>{booking.userName}</p>
                                        <p>{booking.paymentMethod}</p>
                                        <p>{booking.price} EGP</p>
                                        <p>{booking.status}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="booking-identify d-flex align-items-center justify-content-around mt-4 flex-wrap">

                            </div>
                            <div className="booking-social">

                            </div>
                        </div>

                        <div className="modal-footer d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-danger" id='close-btn-edit' data-bs-dismiss="modal" style={{ width: '100px' }}>Close</button>

                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
