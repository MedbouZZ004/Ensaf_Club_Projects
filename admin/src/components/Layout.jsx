import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'
const Layout = () => {
  const hideSidebar = location.pathname === '/login';
  return (
    <main className='flex gap-2'>
        {!hideSidebar && <SideBar />}
        <Outlet />
    </main>
  )
}

export default Layout