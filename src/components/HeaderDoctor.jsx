import { Fragment, useEffect, useState } from 'react'
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

export default function HeaderDoctor({ toggleSidebar, doctorData }) {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <Fragment>
            <header className="header-dash">
                <nav className="navbar container-fluid background py-3 px-4 align-items-center position-fixed top-0 start-0 end-0 z-1 header-height">
                    <div className="container-fluid me-0 flex-1">
                        <span className="navbar-brand mb-0 h1 d-flex align-items-center gap-3 fs-3">
                            <FaBars size={30} onClick={toggleSidebar} cursor={"pointer"} />
                            Dashboard
                        </span>
                        <div className="d-flex align-items-center gap-3 justify-content-between">
                            {/* Dark Mode Toggle */}
                            <button 
                                onClick={toggleDarkMode}
                                className="dark-mode-toggle d-flex align-items-center justify-content-center"
                                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
                            </button>
                            
                            {/* Notification Bell */}
                            <button type="button" className="position-relative me-3">
                                <FaBell size={20} cursor={"pointer"} />
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger rounded-circle notification-badge">
                                    1
                                </span>
                            </button>
                            
                            {/* Doctor Info */}
                            <span className="navbar-brand mb-0 fs-6 fw-bold" style={{ color: 'var(--text-primary)' }}>
                                Welcome, Dr: {doctorData?.fullName}
                            </span>
                            <Link to='/doctor-dashboard/manage-profile'>
                                <img src={doctorData?.profileImage} alt="img-doctor" className="doctor-profile-image" />
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
        </Fragment>
    )
}
