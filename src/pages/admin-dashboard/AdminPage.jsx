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
      <div className='d-flex'>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <ContentAdminDash />
      </div>
    </Fragment>
  )
}
