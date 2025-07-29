import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiSearchAlt2 } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { BeatLoader } from 'react-spinners';



export default function Manageclients() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  //get clients from firestore
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        const bookingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to fetch clients, error:" + error.message, { autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <Fragment>
      <nav aria-label="breadcrumb" className='container-fluid d-flex align-items-center justify-content-between mb-5' style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', marginTop: '20px', padding: '10px 40px', borderRadius: '8px' }} >
        <span className='fw-bold'>Clients</span>
        <ol className="breadcrumb mb-0 py-3 text-align-center" >
          <li className="breadcrumb-item"><Link to="/" className='text-decoration-none' style={{ color: '#D9A741' }}>Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
          <li className="breadcrumb-item active" aria-current="page">Clients</li>
        </ol>
      </nav>





      {/* value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <div className="search-box w-50 position-relative">
          <input
            className="form-control pe-5"
            type="text"
            placeholder="Search by name, email, or responsible doctor"

          />
          <BiSearchAlt2
            size={20}
            className="position-absolute"
            style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', color: '#888' }}
          />
        </div>
        {/* value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} */}
        <select className="form-select w-25" >
          <option value="all" >All</option>
          <option value="booked" >Booked</option>
          <option value="inactive" >Completed</option>
        </select>
      </div>

      {loading ? (<h3 className='text-center mt-5'><BeatLoader color="#D9A741" /></h3>) : bookings?.length === 0 ? (<h3 className='text-center mt-5'>No clients found</h3>) : (

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
      )}
    </Fragment>
  )
}
