import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-blue-400 tracking-tight">ENSAF Club</span>
      </div>
      <div className="flex gap-6">
        <NavLink
          to="."
          end
          className={({ isActive }) =>
            `px-4 py-2 rounded transition-colors duration-200 font-medium text-white hover:bg-blue-600 hover:text-white ${
              isActive ? 'bg-blue-700 text-white' : 'text-gray-200'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="about"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition-colors duration-200 font-medium text-white hover:bg-blue-600 hover:text-white ${
              isActive ? 'bg-blue-700 text-white' : 'text-gray-200'
            }`
          }
        >
          About
        </NavLink>
        <NavLink  to="signUp"
        className={({ isActive }) =>
            `px-4 py-2 rounded transition-colors duration-200 font-medium text-white hover:bg-blue-600 hover:text-white ${
              isActive ? 'bg-blue-700 text-white' : 'text-gray-200'
            }`}>
          SignUp
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar