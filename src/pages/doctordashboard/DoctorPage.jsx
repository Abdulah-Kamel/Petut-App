import { Fragment, useState } from 'react'
import Sidebar from '../../components/doctordash/sidebar-doctor/Sidebar'
import ContentDoctorDash from '../../components/doctordash/content-doctor-dash/ContentDoctorDash'
import HeaderDoctor from '../../components/HeaderDoctor'
export default function DoctorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen) 
  }
  return (
    <Fragment>
      <HeaderDoctor toggleSidebar={toggleSidebar} />
      <div className='d-flex '>
        <Sidebar isOpen={isSidebarOpen} />

        <div
          className="d-flex flex-1"
          // style={{
          //   marginLeft: isSidebarOpen ? '250px' : '100px',
          //   transition: 'margin-left 0.3s ease'
          // }}
        >

        <ContentDoctorDash />
        </div>
      </div>
    </Fragment>
  )
}
