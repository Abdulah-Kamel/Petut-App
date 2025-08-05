import React, { Fragment, useState } from 'react'
import logo from '../../assets/petut.png';
import { MdDelete } from 'react-icons/md';
export default function AppointmentsModal({ clinic, modalId }) {
    const { workingHours: defaultHours } = clinic;

    return (
        <Fragment>
            <div className="modal fade" id={`appointments-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style={{ marginTop: '100px' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Clinic Appointments</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />
                        </div>
                        <div className="modal-body">
                            <form action="#">
                                <div className="appointment mb-3">
                                    <p className='fw-bold mb-2'>Working Hours</p>
                                    {defaultHours?.length > 0 && (
                                        <ul className="mt-3  list-group w-75">
                                            {defaultHours.map((item, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center mb-2 border-2 rounded-4 px-3 py-2">
                                                    <span className="text-gray-500">{item.day} : {item.openTime} - {item.closeTime}</span>
                                                    <button className="btn border-0" disabled >
                                                        <MdDelete size={25} className='text-danger'  />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </form>
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
