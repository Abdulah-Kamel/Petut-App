import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Calendar from '../../components/doctordash/calendar/Calendar';
import { useDarkMode } from '../../context/DarkModeContext';
export default function Manageappointments() {
  const { isDarkMode } = useDarkMode();

  return (
    <Fragment>
      <nav aria-label="breadcrumb" className={`container-fluid d-flex align-items-center justify-content-between ${isDarkMode ? 'bg-dark-2 text-white' : ''}`} style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', marginTop: '20px', padding: '10px 40px', borderRadius: '8px' }} >
        <span className='fw-bold'>Appointments</span>
        <ol className="breadcrumb mb-0 py-3 text-align-center" >
          <li className="breadcrumb-item"><Link to="/" className='text-decoration-none' style={{ color: '#D9A741' }}>Home</Link></li>
          <li className={`breadcrumb-item active ${isDarkMode ? 'text-white-50' : ''}`} aria-current="page">Dashboard</li>
          <li className={`breadcrumb-item active ${isDarkMode ? 'text-white-50' : ''}`} aria-current="page">Appointments</li>
        </ol>
      </nav>
      <Calendar isDarkMode={isDarkMode} />
    </Fragment>
  )
}
