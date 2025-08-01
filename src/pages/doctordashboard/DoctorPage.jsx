import { Fragment, useState } from 'react'
import Sidebar from '../../components/doctordash/sidebar-doctor/Sidebar'
import ContentDoctorDash from '../../components/doctordash/content-doctor-dash/ContentDoctorDash'
import HeaderDoctor from '../../components/HeaderDoctor'
import useBootstrap from '../../hooks/useBootstrap'; 

export default function DoctorDashboard() {
  useBootstrap(); 
  const [sidebarOpen, setsidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setsidebarOpen(!sidebarOpen) 
  }
  return (
    <Fragment>
      <HeaderDoctor toggleSidebar={toggleSidebar} />
      <div className='d-flex '>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className="d-flex flex-1"
          // style={{
          //   marginLeft: sidebarOpen ? '250px' : '100px',
          //   transition: 'margin-left 0.3s ease'
          // }}
        >

        <ContentDoctorDash />
        </div>
      </div>
    </Fragment>
  )
}
