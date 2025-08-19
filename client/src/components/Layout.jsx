import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
const Layout = () => {
  const location = useLocation();
  const hideChrome = location.pathname === '/login' || location.pathname === '/register';
  return (
    <main className='bg-neutral-900 min-h-screen flex flex-col'>
        {!hideChrome && <NavBar />}
        <div className='flex-1'>
          <Outlet />
        </div>
        {!hideChrome && <Footer />}
    </main>
  )
}

export default Layout