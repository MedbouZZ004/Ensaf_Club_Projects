import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'
const Layout = () => {
  const hideSidebar = location.pathname === '/login';
  return (
    <main className='flex gap-2'>
        {!hideSidebar && <SideBar />}
        <div className='bg-gray-50 w-full'>
          <Outlet />
        </div>
        <Outlet />
    </main>
  )
}

export default Layout