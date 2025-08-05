import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiSearchAlt2 } from "react-icons/bi";
import { toast } from 'react-toastify';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { BeatLoader } from 'react-spinners';
import BookingsOneDoctor from './../../components/doctordash/BookingsOneDoctor';
import { getAuth } from 'firebase/auth';



export default function Manageclients() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  const auth = getAuth();
  const currentDoctorId = auth.currentUser?.uid;



  // get bookings from firebase
  useEffect(() => {
    const fetchBookingsOneDoctor = async () => {
      if (!currentDoctorId) return;
      try {
        setLoading(true);
        const q = query(collection(db, "bookings"), where("doctorId", "==", currentDoctorId));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setBookings([]);
          return;
        }
        const bookingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to fetch bookings, error:" + error.message, { autoClose: 3000 });

      } finally {
        setLoading(false);

      }
    };
    fetchBookingsOneDoctor();
  }, [currentDoctorId]);



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
        <select className="form-select w-25" >
          <option value="all" >All</option>
          <option value="booked" >Booked</option>
          <option value="inactive" >Completed</option>
        </select>
      </div>

      {loading ? (<h3 className='text-center mt-5'><BeatLoader color="#D9A741" /></h3>) : bookings?.length === 0 ? (<h3 className='text-center mt-5'>No Bookings found </h3>) : (
        <>
          <BookingsOneDoctor bookings={bookings} />
        </>
      )}
    </Fragment>
  )
}
