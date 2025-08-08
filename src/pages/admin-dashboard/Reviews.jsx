import React, { Fragment } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import DoctorReviewsModal from '../../components/admindash/DoctorReviewsModal';


export default function Reviews() {
    return (
        <Fragment>
            <h1>Reviews</h1>
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="search-box position-relative" style={{ width: '40%' }}>
                    <input
                        className="form-control pe-5"
                        type="text"
                        placeholder="Search by Doctor Name"


                    />
                    <BiSearchAlt2
                        size={20}
                        className="position-absolute"
                        style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', color: '#888' }}
                    />
                </div>
                <select className="form-select w-25"  >
                    <option value="all" >All</option>
                    <option value="male" >Highest rating</option>
                    <option value="female" >Lowest rating</option>
                </select>
            </div>
            <div className="patient-table mt-4 bg-white shadow rounded w-100">
                <table className="table">
                    <thead className="table-light py-3">
                        <tr className="">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Specialization</th>
                            <th className="px-4 py-3">Gender</th>
                            <th className="px-4 py-3">Number of reviews</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr >
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3"></td>
                            {/* <td className="px-4 py-3" ><span style={{ color: 'white', backgroundColor: doctor.gender === 'male' ? '#007BFF ' : '#E91E63 ', fontSize: '14px' }} className='px-3 py-1 rounded rounded-5 '>{doctor.gender}</span></td> */}
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3 d-flex align-items-center gap-2 ">
                                
                                <button type="button" className="btn border-0 p-0 mb-1" data-bs-toggle="modal" data-bs-target="#review">
                                    <FaEye cursor={"pointer"}  />
                                </button>
                                <DoctorReviewsModal />

                                <MdDelete cursor={"pointer"} size={20} className='text-danger' />
                            </td>

                        </tr>



                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}
