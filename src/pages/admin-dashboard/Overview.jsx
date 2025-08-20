import React, { Fragment, useEffect, useState } from 'react';
import Statistic from '../../components/admindash/Statistic.jsx';
import { FaUserDoctor, FaUsers, FaSackDollar } from "react-icons/fa6";
import { FaClinicMedical, FaCalendarAlt } from "react-icons/fa";
import { db } from '../../firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import logo from '../../assets/petut.png';

export default function Overview() {
  const [doctors, setDoctors] = useState([]);
  const [clients, setClients] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

  useEffect(() => {
    fetchDoctors();
    fetchClients();
    fetchClinics();
    fetchBookings();
    fetchRevenue();
  }, []);

  const fetchDoctors = async () => {
    const doctorsRef = collection(db, 'users');
    const q = query(doctorsRef, where('role', '==', 'doctor'));
    const snapshot = await getDocs(q);
    setDoctors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchClients = async () => {
    const clientsRef = collection(db, 'users');
    const q = query(clientsRef, where('role', '==', 'customer'));
    const snapshot = await getDocs(q);
    setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchClinics = async () => {
    const snapshot = await getDocs(collection(db, 'clinics'));
    setClinics(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchBookings = async () => {
    const snapshot = await getDocs(collection(db, 'bookings'));
    setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchRevenue = async () => {
    const snapshot = await getDocs(collection(db, 'payments'));
    let total = 0;
    let today = 0;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    snapshot.forEach(doc => {
      const data = doc.data();
      const amount = data.amount || 0;
      total += amount;

      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : null;
      if (createdAt && createdAt >= startOfDay && createdAt < endOfDay) {
        today += amount;
      }
    });

    setTotalRevenue(total);
    setTodayRevenue(today);
  };

  const statistics = [
    { title: 'Total Doctors', count: doctors.length, icon: <FaUserDoctor size={40} className="statistic-icon" /> },
    { title: 'Total Users', count: clients.length, icon: <FaUsers size={40} className="statistic-icon" /> },
    { title: 'Total Clinics', count: clinics.length, icon: <FaClinicMedical size={40} className="statistic-icon" /> },
    { title: 'Total Bookings', count: bookings.length, icon: <FaCalendarAlt size={40} className="statistic-icon" /> },
    { title: 'Total Revenue', count: totalRevenue, icon: <FaSackDollar size={40} className="statistic-icon" /> },
    { title: "Today's Revenue", count: todayRevenue, icon: <FaSackDollar size={40} className="statistic-icon" /> },
  ];

  return (
    <Fragment>
      <div className="container-fluid background-secondary p-4">
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className='left'>
              <h1 className="text-primary-app">Main Control Panel</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Activities Overview</p>
            </div>
            <div className="right">
              <img src={logo} width={100} height={100} alt="Petut Logo" />
            </div>
          </div>

          <div className="statistics mt-5 d-flex align-items-center justify-content-center gap-4 flex-wrap">
            {statistics.map(stat => (
              <Statistic key={stat.title} title={stat.title} count={stat.count} icon={stat.icon} />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
