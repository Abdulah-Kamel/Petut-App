import { Fragment, useEffect, useState } from 'react'
import { FaBars } from "react-icons/fa";

import { FaBell } from "react-icons/fa6";
import { Link } from 'react-router-dom';

export default function HeaderDoctor({ toggleSidebar, doctorData }) {

    return (
        <Fragment>
            <header className="header-dash">
                <nav className="navbar container-fluid background py-3 px-4 align-items-center position-fixed top-0 start-0 end-0 z-1 " style={{ height: '100px', borderBottom: '1px solid #D9A741' }}>

                    <div className="container-fluid me-0 flex-1 " >
                        <span className="navbar-brand mb-0 h1 d-flex align-items-center gap-3 fs-3"><FaBars size={30} onClick={toggleSidebar} cursor={"pointer"} />Dashboard</span>
                        <div className="d-flex align-items-center gap-2 text-white justify-content-between">

                            <button type="button" class="position-relative me-3">
                                <FaBell size={20} cursor={"pointer"} color='#000' />
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger  rounded-circle" style={{ fontSize: '12px', width: '20px', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >1</span>
                            </button>
                            <span className="navbar-brand mb-0 fs-6 fw-bold">Welcome, Dr: {doctorData?.fullName}</span>
                            <Link to='/doctor-dashboard/manage-profile'>
                                <img src={doctorData?.profileImage} alt="img-doctor" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

        </Fragment>
    )
}
