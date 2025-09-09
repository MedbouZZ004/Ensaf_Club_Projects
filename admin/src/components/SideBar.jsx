import React, { useState, useRef, useEffect } from 'react';
import { BsGraphUpArrow } from "react-icons/bs";
import { TbSteam } from "react-icons/tb";
import { IoMdLogOut } from "react-icons/io";
import { FiActivity } from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdMenu, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import { RiUserCommunityFill } from "react-icons/ri";
import {FaUser} from 'react-icons/fa';
const SideBar = () => {
  const {logout} = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('admin'));
  const resizeHandleRef = useRef(null);

  const superAdminLinks = [
    {
      name: "Statistics",
      path: ".",
      icon: <BsGraphUpArrow />
    },
    {
      name: "Clubs",
      path: "clubs",
      icon: <TbSteam />
    },
    {
      name: "Logout",
      path: "login",
      logout: logout,
      icon: <IoMdLogOut />
    },
  ];

  const adminLinks = [
    {
      name: "Statistics",
      path: ".",
      icon: <BsGraphUpArrow />
    },
    {
      name: "Admin Profile",
      path: "admin-profile",
      icon: <FaUser />
    },
    {
      name: "Club Activities",
      path: "club-activities",
      icon: <FiActivity />
    },
    {
      name:"Board members",
      path:"club-board-members",
      icon:<RiUserCommunityFill />,
    },
    {
      name: "Logout",
      path: "login",
      icon: <IoMdLogOut />,
      logout: logout
    }
  ];

  const role = user.role;
  const links = role === 'superAdmin' ? superAdminLinks : adminLinks;

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 200 && newWidth < 400) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth < 1024 && isOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(e.target) &&
          !e.target.classList.contains('toggle-sidebar')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-orange-400 text-white p-2 rounded-md toggle-sidebar"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{
          width: width,
          x: window.innerWidth < 1024 ? (isOpen ? 0 : -width) : 0
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="h-full min-h-screen bg-white border-r border-gray-200 flex flex-col px-3 py-4 gap-8 shadow-sm fixed lg:relative z-40"
        style={{ width }}
      >
        <div
          ref={resizeHandleRef}
          className="absolute -right-2 top-0 bottom-0 w-2 cursor-col-resize opacity-0 hover:opacity-100 transition-opacity z-50"
          onMouseDown={() => setIsResizing(true)}
          style={{ display: window.innerWidth < 1024 ? 'none' : 'block' }}
        >
          <div className="w-1 h-full bg-orange-300/50 ml-1 rounded-full"></div>
        </div>

        <div className="flex flex-col items-center gap-2 mb-2">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 200 }}
          >
            <MdDashboard size={44} className="text-orange-400 mb-1" />
          </motion.div>
          <h3 className="font-bold text-lg font-roboto text-gray-800 text-center">
            {role === 'superAdmin' ? 'Super Admin' : 'Club Admin'}
          </h3>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 mt-4 flex-grow">
          {links.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={link.path}
                onClick={() => {
                    (window.innerWidth < 1024 && setIsOpen(false));
                    (link.logout && link.logout())
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 font-roboto px-4 py-3 rounded-lg font-medium text-gray-700 transition-all duration-200
                  hover:bg-orange-100 hover:text-orange-700 group
                  ${isActive ? 'bg-orange-200 text-orange-800 shadow-sm' : ''}`
                }
              >
                <span className="text-xl transition-transform duration-200 group-hover:scale-110">{link.icon}</span>
                <span className="whitespace-nowrap overflow-hidden">{link.name}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 relative h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">
              <div className="w-3 rounded-full absolute right-0 bottom-0 h-3 bg-green-500"/>
              {role === 'superAdmin' ? 'S' : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">{user.fullname}</p>
              <p className="text-xs text-gray-500 truncate">{role === 'superAdmin' ? 'Super Admin' : 'Club Admin'}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default SideBar;