import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { FaUsers } from "react-icons/fa6";
import { FaChartBar, FaClinicMedical } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { GrOverview } from "react-icons/gr";
import { IoStatsChart } from "react-icons/io5";
import { MdReviews } from "react-icons/md";
import { RiCustomerService2Line, RiCustomerServiceLine } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
// import logo from '../../assets/petut.png';
import { HiShoppingBag } from "react-icons/hi2";
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function Sidebar({ open,toggleSidebar }) {

      const handleLogout = async () => {
        try {
          await signOut(auth);
          navigate("/login");
        } catch (error) {
          toast.error("Failed to log out", { autoClose: 3000 });
        }
      };
    return (
        <Fragment>
            <div className={`sidebar background d-flex flex-column flex-shrink-0 p-3 position-absolute ${open ? 'expanded' : 'collapsed'}`} style={{ top: '100px', borderRight: '1px solid #D9A741', zIndex: '999', minHeight: 'calc(100vh - 100px)' }} >
                <ul className=" p-0 d-flex flex-column align-items-left justify-content-between" style={{ minHeight: '100vh' }}>
                    <div className="top-links">
                        {/* <div className="logo">
                            <img src={logo} width={'80px'} height={'80px'} alt="logo" className='text-left' />

                        </div> */}
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/overview"
                                style={({ isActive }) => ({ color: isActive ? "#D9A741" : "black" })}
                                className="text-decoration-none d-flex align-items-center gap-2"
                                onClick={toggleSidebar}
                            >
                                <GrOverview size={25} />

                                <span className="fw-bold">Overview</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/manage-users"
                                style={({ isActive }) => ({ color: isActive ? "#D9A741" : "black" })}
                                className="text-decoration-none d-flex align-items-center gap-2"
                                onClick={toggleSidebar}
                            >
                                <FaUsers size={25} />

                                <span className="fw-bold">Manage Users</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/manage-clinics"
                                style={({ isActive }) => ({ color: isActive ? "#D9A741" : "black" })}
                                className="text-decoration-none d-flex align-items-center gap-2"
                                onClick={toggleSidebar}
                            >
                                <FaClinicMedical size={25} />
                                <span className="fw-bold">Manage Clinics</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/manage-reservations"
                                style={({ isActive }) => ({ color: isActive ? "#D9A741" : "black" })}
                                className="text-decoration-none d-flex align-items-center gap-2"
                                onClick={toggleSidebar}
                            >
                                <FaCalendarAlt size={25} />
                                <span className="fw-bold"> Reservations</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/reviews"
                                style={({ isActive }) => ({ color: isActive ? "#D9A741" : "black" })}
                                className="text-decoration-none d-flex align-items-center gap-2"
                                onClick={toggleSidebar}
                            >
                                <MdReviews size={25} />
                                <span className="fw-bold">Reviews</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/store"
                                style={({ isActive }) => ({ color: isActive ? "#D9A741" : "black" })}
                                className="text-decoration-none d-flex align-items-center gap-2"
                                onClick={toggleSidebar}
                            >
                                <HiShoppingBag size={25} />
                                <span className="fw-bold">Store</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/charts"
                                style={({ isActive }) => ({ color: isActive ? "#D9A741" : "black" })}
                                className="text-decoration-none d-flex align-items-center gap-2"
                                onClick={toggleSidebar}
                            >
                                <IoStatsChart size={25} />
                                 <span className="fw-bold">Charts</span>
                            </NavLink>
                        </li>
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/admin-dashboard/support"
                                style={({ isActive }) => ({ color: isActive ? "#D9A741" : "black" })}
                                className="text-decoration-none d-flex align-items-center gap-2"
                                onClick={toggleSidebar}
                            >
                                <BiSupport size={25} style={{ display: 'inline-block', minWidth: '25px' }} />
                                {/* Fallback icon if BiSupport doesn't load */}
                                <span style={{ display: 'none' }}>🎧</span>
                                <span className="fw-bold">Support</span>
                            </NavLink>
                        </li>
                    </div>
                    <div className="bottom-link">
                        <li className="mb-2 p-3">
                            <NavLink
                                to="/login"
                                style={({ isActive }) => ({ color: isActive ? "#D9A741" : "black" })}
                                className="text-decoration-none d-flex align-items-center gap-2"
                                onClick={
                                    () => {
                                        handleLogout();
                                        toggleSidebar;
                                    }
                                }
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
