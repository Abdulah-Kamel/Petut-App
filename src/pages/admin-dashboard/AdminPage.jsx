import { Fragment, useState } from 'react'
import Sidebar from '../../components/admindash/Sidebar'
import ContentAdminDash from '../../components/admindash/ContentAdminDash'
import HeaderAdmin from '../../components/HeaderAdmin'
import useBootstrap from '../../hooks/useBootstrap'

export default function AdminDashboard() {
  useBootstrap()
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
