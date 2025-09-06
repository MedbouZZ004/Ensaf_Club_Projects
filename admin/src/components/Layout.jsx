import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'
const Layout = () => {
  const hideSidebar = location.pathname === '/login';
  return (
    <main className='flex'>
        {!hideSidebar && <SideBar />}
        <div className='bg-gray-50 w-full'>
          <Outlet />
        </div>
    </main>
  )
}

export default Layout