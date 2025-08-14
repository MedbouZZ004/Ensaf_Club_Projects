import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
const Layout = () => {
  return (
    <main className='bg-black text-white h-screen'>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </main>
  )
}

export default Layout