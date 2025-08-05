import React, { Fragment } from 'react'
import { FaEye } from "react-icons/fa";


export default function BookingsOneDoctor({ bookings}) {

    
    return (
        <Fragment>
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
                        {bookings ? bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td className="px-4 py-3">{booking?.clinicName || "-"}</td>
                                <td className="px-4 py-3">{booking?.clinicLocation || "-"}</td>
                                <td className="px-4 py-3">{booking?.clinicPhone || "-"}</td>
                                {/* <td className="px-4 py-3">{booking?.date || "-"}</td> */}
                                <td className="px-4 py-3">{booking?.time || "-"}</td>
                                <td className="px-4 py-3">{booking?.price || "-"}</td>
                                <td className="px-4 py-3">
                                    <select className="form-select w-50" aria-label="Default select example">
                                        <option value="completed">{booking?.status || "-"}</option>
                                        <option value="booked">booked</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <button type="button" className="btn border-0 p-0 mb-1" data-bs-toggle="modal" data-bs-target="#review">
                                        <FaEye cursor={"pointer"} />
                                    </button>
                                </td>
                            </tr>
                        )) : <h1>Loading...</h1>}
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}
