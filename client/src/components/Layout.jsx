import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
const Layout = () => {
  return (
    <main className='bg-neutral-900  flex-col gap-3 h-screen'>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </main>
  )
}

export default Layout