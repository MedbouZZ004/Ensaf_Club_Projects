import React from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FiLogIn, FiX } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { MdOutlineTranslate,MdLogout } from "react-icons/md";
import { FaUser,FaHeart } from "react-icons/fa";
import UserCard from './UserCard';
const NavBar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isOpen, setIsOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openUserMenu, setOpenUserMenu] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const languages = [
    { 
      id: 1,
      name: "English"
    },
    {
      id: 2,
      name: "French"
    }
  ];

  const [selectedLanguage, setSelectedLanguage] = React.useState(languages[0]);
  // close menus on route change
  React.useEffect(() => {
    setMobileOpen(false);
    setIsOpen(false);
  }, [location.pathname]);
  return (
    <nav className="relative  z-50  flex items-center justify-between px-4 sm:px-6 py-3 md:py-4">
      {openUserMenu && <UserCard 
      setOpenUserMenu={setOpenUserMenu}
      user={user} />}
       <div
        aria-hidden
        className='pointer-events-none absolute z-0 top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[250px] h-[70vw] max-h-[250px] bg-orange-200/30 rounded-full blur-[130px]'
      />
     <Link to="." className='shrink-0 hover:scale-110 duration-200 ease-in'>
        <img className='w-16 sm:w-20' src="/logo.png" alt="Logo" />
      </Link>

      <div className='hidden md:flex items-center w-[60%] justify-between gap-6'>
        <div className='relative ml-25'>
          <button
            className='text-[#FFC58D] font-roboto flex items-center gap-2 cursor-pointer text-base'
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label="Select language"
          >
          <MdOutlineTranslate /> {selectedLanguage.name} {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </button>
          {isOpen && (
            <div className='absolute bg-neutral-900 flex flex-col top-10 right-0 border-1 border-orange-300/50 overflow-hidden rounded-xl  min-w-20'>
              {languages.map(lang => (
                <button 
                  onClick={()=>{ setSelectedLanguage(lang); setIsOpen(false); }}
                  key={lang.id}
                  role="option"
                  aria-selected={selectedLanguage.id === lang.id}
                  className='text-white text-left hover:bg-gray-700 px-4 py-2 cursor-pointer w-full'
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
        {
          user?
          <button
          onClick={()=>{setOpenUserMenu(v => !v);}} 
          className='text-[#FFC58D] w-10 h-10 hover:bg-neutral-700/70 ease-in duration-200 gap-2 flex items-center cursor-pointer justify-center bg-neutral-800 border-1 border-orange-300/60  rounded-full'>
            <FaUser />
          </button>
          :
          <button 
          onClick={()=>{ navigate('/login') }}
          className='text-[#FFC58D] gap-2 flex items-center cursor-pointer bg-neutral-800 border-1 border-orange-300/60 px-4 py-1.5 rounded-lg shadow-orange-200 shadow-xs '
        >
          Login <FiLogIn size={20}/>
        </button>}
      </div>

      {/* mobile toggle */}
      <button
        type='button'
        className='md:hidden inline-flex items-center justify-center rounded-md px-3 py-2 text-[#FFC58D]'
        onClick={() => setMobileOpen(v => !v)}
        aria-label='Toggle menu'
        aria-controls='mobile-nav'
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <FiX size={25} /> : <HiMiniBars3BottomRight size={30} />}
      </button>

      {mobileOpen && (
        <div id='mobile-nav' className='md:hidden absolute right-2 top-full mt-2'>
          <div className='w-40 rounded-lg border-1 border-orange-300/40 bg-neutral-900/85 backdrop-blur-md p-2.5 shadow-md shadow-orange-200/10'>
            <div className='flex flex-col gap-1.5'>
              <div className='flex flex-col gap-1'>
                <MdOutlineTranslate className='text-orange-300 mb-2' size={20} />
                <div className='flex gap-1.5 flex-wrap'>
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-1.5 py-0.5 rounded-md border-1 text-[10px] ${selectedLanguage.id === lang.id ? 'border-orange-300/80 bg-neutral-800 text-orange-200' : 'border-orange-300/40 text-[#FFC58D]'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
              {user ? 
              <button className='text-[#FFC58D] gap-2 flex items-center cursor-pointer bg-neutral-800 border-1 border-orange-300/60 px-4 py-1.5 rounded-lg shadow-orange-200 shadow-xs '>
                <FaUser />
              </button>
              :
              <button 
                onClick={()=>{ navigate('/login') }}
                className='mt-1 w-full justify-center text-[#FFC58D] gap-2 inline-flex items-center cursor-pointer  px-2.5 py-1 rounded-md'
              >
                Login <FiLogIn size={14}/>
              </button>}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar