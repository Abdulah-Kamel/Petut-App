import { Fragment, useState } from 'react'
import Sidebar from '../../components/admindash/Sidebar'
import ContentAdminDash from '../../components/admindash/ContentAdminDash'
import HeaderAdmin from '../../components/HeaderAdmin'

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Fragment>
      <HeaderAdmin toggleSidebar={toggleSidebar} />
      <div className='d-flex '>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className="d-flex flex-1"
          // style={{
          //   marginLeft: sidebarOpen ? '250px' : '100px',
          //   transition: 'margin-left 0.3s ease'
          // }}
          >

          <ContentAdminDash />
        </div>
      </div>
    </Fragment>
  )
}
