import React, { Fragment } from 'react'
import Statistic from '../../components/admindash/Statistic.jsx'
import { FaUserDoctor } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import Charts from './Charts';

export default function Overview() {
    const statistics = [
        { title: 'Total Doctors', count: '100', icon: <FaUserDoctor size={40} /> },
        { title: 'Total Clients', count: '100', icon: <FaUsers size={40} /> },
        { title: 'Total clinics', count: '100', icon: <FaClinicMedical size={40} /> },
        { title: 'Total Reservations', count: '100', icon: <FaCalendarAlt size={40} /> },
        { title: 'Total Revenue', count: '100', icon: <FaSackDollar size={40} /> },
        { title: 'Today`s Revenue', count: '100', icon: <FaSackDollar size={40} /> },
    ]

    return (
        <Fragment>
            <div className='container-fluid mt-4'>
                <div className='statistics mb-5'>
                    <div className='mb-3'>
                        <h1>Main control panel</h1>
                        <p className=''>Activities Overview</p>
                    </div>
                    <div className="statistics mt-5 d-flex align-items-center justify-content-center gap-4 flex-wrap">
                        {statistics.map((statistic, index) => (
                            <Statistic key={index} title={statistic.title} count={statistic.count} icon={statistic.icon} />
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
