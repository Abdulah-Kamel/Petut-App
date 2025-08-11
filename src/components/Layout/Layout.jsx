import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingHelpButton from '../FloatingHelpButton/FloatingHelpButton'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
      <FloatingHelpButton />

    </div>

  )
}

export default Layout