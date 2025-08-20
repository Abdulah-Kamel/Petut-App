import { Fragment } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaUsers } from "react-icons/fa6";
import { FaChartBar, FaClinicMedical } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { GrOverview } from "react-icons/gr";
import { IoStatsChart } from "react-icons/io5";
import { MdReviews } from "react-icons/md";
import { RiCustomerService2Line, RiCustomerServiceLine } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { HiShoppingBag } from "react-icons/hi2";
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
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
                 style={{ top: '100px', zIndex: '1000' }} >
                <ul className="p-0 d-flex flex-column align-items-left justify-content-between h-100" >
                    <div className="top-links">
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/overview"
                                className={({ isActive }) =>
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <GrOverview size={25} />
                                <span className="fw-bold">Overview</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/manage-users"
                                className={({ isActive }) =>
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <FaUsers size={25} />
                                <span className="fw-bold">Manage Users</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/manage-clinics"
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
                                to="/admin-dashboard/manage-reservations"
                                className={({ isActive }) =>
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <FaCalendarAlt size={25} />
                                <span className="fw-bold"> Reservations</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/reviews"
                                className={({ isActive }) =>
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <MdReviews size={25} />
                                <span className="fw-bold">Reviews</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/store"
                                className={({ isActive }) =>
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <HiShoppingBag size={25} />
                                <span className="fw-bold">Store</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/charts"
                                className={({ isActive }) =>
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <IoStatsChart size={25} />
                                <span className="fw-bold">Charts</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/support"
                                className={({ isActive }) =>
                                    `text-decoration-none d-flex align-items-center gap-2 nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <BiSupport size={25} style={{ display: 'inline-block', minWidth: '25px' }} />
                                <span className="fw-bold">Support</span>
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
                                <span className="fw-bold">Logout</span>
                            </NavLink>
                        </li>
                    </div>
                </ul>
            </div>
        </Fragment>
    )
}