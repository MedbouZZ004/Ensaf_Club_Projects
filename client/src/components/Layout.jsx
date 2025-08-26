import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import Welcoming from './Welcoming'
const Layout = () => {
  const location = useLocation();
  const hideChrome = location.pathname === '/login' || location.pathname === '/register' ||  location.pathname === '/forgot-password' || location.pathname === '/reset-password';
  const [showIntro, setShowIntro] = React.useState(() => {
    try {
      return localStorage.getItem('intro_seen') ? false : true;
    } catch {
      return true;
    }
  });
  const handleFinishIntro = React.useCallback(() => {
    try { localStorage.setItem('intro_seen', '1'); } catch { /* ignore */ }
    setShowIntro(false);
  }, []);
  return (
    <main className='bg-neutral-900 min-h-screen flex flex-col'>
        {showIntro && <Welcoming onFinish={handleFinishIntro} />}
        {!hideChrome && <NavBar />}
        <div className='flex-1'>
          <Outlet />
        </div>
        {!hideChrome && <Footer />}
    </main>
  )
}

export default Layout