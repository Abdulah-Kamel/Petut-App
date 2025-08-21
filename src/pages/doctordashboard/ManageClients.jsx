import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.js';
import BookingsOneDoctor from './../../components/doctordash/BookingsOneDoctor';
import { getAuth, onAuthStateChanged } from 'firebase/auth';



export default function Manageclients() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  const auth = getAuth();
  const currentDoctorId = auth.currentUser?.uid;



  // get bookings from firebase
useEffect(() => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    const fetchBookingsOneDoctor = async () => {
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }
      try {
        console.log(user.uid);
        
        setLoading(true);
        const q = query(collection(db, "bookings"), where("doctorId", "==", user.uid));
        const snapshot = await getDocs(q);
        const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to fetch bookings: " + error.message, { autoClose: 3000 });
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsOneDoctor();
  });

  return () => unsubscribe();
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
      <BookingsOneDoctor bookings={bookings} setBookings={setBookings} />
    </Fragment>
  )
}


