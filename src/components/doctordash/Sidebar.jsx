import { Fragment } from 'react'
import { MdManageAccounts } from "react-icons/md";
import { GrSchedules } from "react-icons/gr";
import { FaClinicMedical } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { NavLink, useNavigate } from 'react-router-dom';
import { TbLogout2 } from "react-icons/tb";
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { toast } from 'react-toastify';

export default function Sidebar({ open, toggleSidebar }) {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("success logout", { autoClose: 3000 });
            navigate("/login");
        } catch (error) {
            toast.error("Failed to log out, error:" + error.message, { autoClose: 3000 });
        }
    };
    
    return (
        <Fragment>
            <div className={`sidebar background d-flex flex-column flex-shrink-0 p-3 position-fixed bottom-0 ${open ? 'expanded' : 'collapsed'}`} 
                 style={{ top: '100px', zIndex: '1000' }}>
                <ul className="p-0 d-flex flex-column align-items-left justify-content-between h-100">
                    <div className="top-links">
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/doctor-dashboard/manage-clients"
                                className={({ isActive }) => 
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <MdManageAccounts size={30} />
                                <span className="fw-bold">Manage Clients</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/doctor-dashboard/manage-appointments"
                                className={({ isActive }) => 
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <GrSchedules size={25} />
                                <span className="fw-bold">Appointments</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/doctor-dashboard/manage-clinics"
                                className={({ isActive }) => 
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <FaClinicMedical size={25} />
                                <span className="fw-bold">Manage Clinics</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/doctor-dashboard/manage-profile"
                                className={({ isActive }) => 
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <IoPersonSharp size={25} />
                                <span className="fw-bold">Profile</span>
                            </NavLink>
                        </li>
                    </div>
                    <div className="bottom-link">
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/login"
                                className="text-decoration-none d-flex align-items-center gap-2 nav-link"
                                onClick={handleLogout}
                            >
                                <TbLogout2 size={25} />
                                <span className="fw-bold">Log out</span>
                            </NavLink>
                        </li>
                    </div>
                </ul>
            </div>
        </Fragment>
    )
}
