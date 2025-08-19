import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
const Layout = () => {
  return (
    <main className='bg-neutral-900  flex-col gap-3'>
        {window.location.pathname !== "/login" && window.location.pathname !== "/register" && <NavBar />}
        <Outlet/>
        {window.location.pathname !== "/login" && window.location.pathname !== "/register" && <Footer />}
    </main>
  )
}

export default Layout