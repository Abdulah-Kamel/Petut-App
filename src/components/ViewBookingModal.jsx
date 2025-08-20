import { Fragment } from "react";
import logo from '../assets/petut.png'
export default function ViewBookingModal({ book, modalId }) {
    return (
        <Fragment>
            <div className="modal fade" id={`viewbooking-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between pe-0 py-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">booking Details</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />
                        </div>
                        <div className="modal-body px-3">
                            <div className="d-flex align-items-start gap-5 ">
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
