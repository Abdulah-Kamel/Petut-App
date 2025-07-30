import { Fragment, useState } from 'react'
import Sidebar from '../../components/admindash/Sidebar'
import ContentAdminDash from '../../components/admindash/ContentAdminDash'
import HeaderAdmin from '../../components/HeaderAdmin'

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <Fragment>
      <HeaderAdmin toggleSidebar={toggleSidebar} />
      <div className='d-flex '>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className="d-flex flex-1"
          // style={{
          //   marginLeft: isSidebarOpen ? '250px' : '100px',
          //   transition: 'margin-left 0.3s ease'
          // }}
          >

          <ContentAdminDash />
        </div>
      </div>
    </Fragment>
  )
}
