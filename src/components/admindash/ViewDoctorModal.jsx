import React, { Fragment } from 'react'
import logo from '../../assets/petut.png'

import ReactStars from "react-rating-stars-component";
import { Link } from 'react-router-dom';

export default function ViewDoctorModal({ doctor, modalId }) {
    if (!doctor) return null;
    return (
        <Fragment>
            <div className="modal fade" id={`viewdoctor-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between pe-0 py-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Doctor Details</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />
                        </div>
                        <div className="modal-body ">
                            <div className="d-flex align-items-start gap-5">
                                <div className="left">
                                    <img src={doctor?.profileImage} alt="doctor-image" style={{ width: '250px', height: '250px' }} />
                                </div>
                                <div className="right d-flex align-items-start gap-3">
                                    <div className="">
                                        <p>Doctor Name :</p>
                                        <p>Email :</p>
                                        <p>Phone :</p>
                                        <p>Experience :</p>
                                        <p>Description :</p>
                                        <p>Status :</p>
                                        <p>Gender :</p>
                                        {/* <p>Rate :</p> */}
                                    </div>
                                    <div className="">

                                        <p>{doctor.fullName || ''}</p>
                                        <p>{doctor.email || ''}</p>
                                        <p>{doctor.phone || ''}</p>
                                        <p>{doctor.doctorDetails.experience || ''} Years</p>
                                        <p >{doctor.doctorDetails.description || ''}</p>
                                        <p style={{ color: 'white', backgroundColor: doctor.status === 'active' ? '#28a745  ' : '#6c757d   ', fontSize: '14px' }} className='px-3 py-1  rounded rounded-5  text-center w-50 '>{doctor.status || ''}</p>
                                        <p style={{ color: 'white', backgroundColor: doctor.gender === 'male' ? '#007BFF ' : '#E91E63 ', fontSize: '14px' }} className='px-3 py-1 rounded rounded-5 text-center w-50'>{doctor.gender || ''}</p>
                                        {/* <p className='mb-0'>
                                            <ReactStars
                                                count={3}
                                                value={5}
                                                edit={false}
                                                size={24}
                                                activeColor="#ffd700"

                                            />
                                        </p> */}
                                    </div>
                                </div>
                            </div>
                            <div className="doctor-identify d-flex align-items-center justify-content-around mt-4 flex-wrap">
                                <img src={doctor?.doctorDetails.cardFrontImage} alt="card-front-image" className='w-25' />
                                <img src={doctor?.doctorDetails.cardBackImage} alt="card-back-image" className='w-25' />
                                <img src={doctor?.doctorDetails.idImage} alt="id-image" className='w-25' />
                            </div>
                            <div className="doctor-social">
                                <h4 className='mt-4'>Social Media</h4>
                                <p><span>Facebook :</span><Link> {doctor?.doctorDetails.socialMedia.facebook || ''}</Link></p>
                                <p><span>Instagram :</span><Link> {doctor?.doctorDetails.socialMedia.instagram || ''}</Link></p>
                                <p><span>Twitter :</span><Link> {doctor?.doctorDetails.socialMedia.twitter || ''}</Link></p>
                                <p><span>Linkedin :</span><Link> {doctor?.doctorDetails.socialMedia.linkedin || ''}</Link></p>
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
