import React from 'react'
import { motion } from 'framer-motion'
import { FaUser } from "react-icons/fa";
import { IoMdLogOut } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore'
const UserCard = ({user, setOpenUserMenu}) => {
  const navigate = useNavigate();
  const logout = useAuthStore?.(s => s.logout);

  const initial = { opacity: 0, y: -8, scale: 0.98 };
  const animate = { opacity: 1, y: 0, scale: 1 };
  const transition = { duration: 0.22, ease: 'easeOut' };

  const initials = (user?.fullname || user?.full_name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('');

  const handleLogout = async () => {
    try {
      await logout?.();
      navigate('/');
    } catch {
      // no-op
    }
  };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={initial}
      transition={transition}
      role="menu"
      aria-label="User menu"
      className='absolute top-20 right-4 z-[100] w-64 rounded-xl border border-orange-300/30 bg-neutral-900/95 backdrop-blur-md text-white shadow-lg shadow-orange-200/10'
    >
      {/* Header */}
      <div className='flex items-center gap-3 px-4 py-3 border-b border-orange-300/20'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-orange-300/30 text-orange-200 font-semibold'>
          {initials || 'U'}
        </div>
        <div className='min-w-0'>
          <div className='text-sm font-medium text-orange-100 truncate'>{user?.fullname || user?.full_name || 'User'}</div>
          {user?.email && (
            <div className='text-xs text-neutral-300 truncate'>{user.email}</div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className='py-'>
        <Link
          to={'/user-profile'}
          onClick={() => setOpenUserMenu(false)}
          role='menuitem'
          className='flex items-center gap-3 px-4 py-2 text-sm text-orange-50 hover:bg-white/5 focus:bg-white/10 focus:outline-none transition-colors'
        >
          <FaUser className='text-orange-200' />
          Profile
        </Link>
        <button
          type='button'
          onClick={()=>{
            handleLogout();
            setOpenUserMenu(false);
          }}
          role='menuitem'
          className='w-full cursor-pointer text-left flex items-center gap-3 px-4 py-2 text-sm text-orange-50 hover:bg-white/5 focus:bg-white/10 focus:outline-none transition-colors'
        >
          <IoMdLogOut className='text-orange-200' />
          Logout
        </button>
      </div>
    </motion.div>
  )
}

export default UserCard