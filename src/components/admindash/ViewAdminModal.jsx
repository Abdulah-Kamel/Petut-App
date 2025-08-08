import React, { Fragment } from 'react'
import logo from '../../assets/petut.png'

export default function ViewAdminModal({ admin, modalId }) {
    const { profileImage, fullName, email, phone, gender, role } = admin;
    if (!admin) return null;
    return (
        <Fragment>
            <div className="modal fade" id={`viewadmin-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Admin Details</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />
                        </div>
                        <div className="modal-body d-flex align-items-center gap-5 ">
                            <div className="left user-image text-center mb-3">
                                <img src={admin.profileImage} alt="user-image" style={{ width: '250px', height: '250px' }} />
                            </div>
                            <div className="right user-details d-flex flex-1 align-items-start gap-3">
                                <div className="">
                                    <p>Name :</p>
                                    <p>Email :</p>
                                    <p>Phone :</p>
                                    <p >Role :</p>
                                </div>
                                <div className="flex-1">
                                    <p>{admin.fullName || ''}</p>
                                    <p>{admin.email || ''}</p>
                                    <p>{admin.phone || ''}</p>
                                    <p style={{ color: 'white', backgroundColor: admin.role === 'customer' ? '#12101285 ' : '#007BFF ', fontSize: '14px' }} className='px-3 py-1 mb-0 rounded rounded-5 w-25 text-center'>{admin.role || ''}</p>
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
