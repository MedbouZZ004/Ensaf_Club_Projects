import React from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
const NavBar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
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
    <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 py-3 md:py-4">
      {/* logo */}
      <Link to="." end className='shrink-0'>
        <img className='w-16 sm:w-20' src="/logo.png" alt="Logo" />
      </Link>

      {/* desktop menu */}
      <div className='hidden md:flex items-center w-[60%] justify-between gap-6'>
        <NavLink to="." end className={({isActive}) => `text-[#FFC58D] font-roboto text-lg ${isActive ? 'font-medium':'font-light'}`}>
          Home
        </NavLink>
        <NavLink to="about" className={({isActive}) => `text-[#FFC58D] font-roboto text-lg ${isActive ? 'font-medium':'font-light'}`}>
          About
        </NavLink>
        <div className='relative'>
          <button
            className='text-[#FFC58D] font-roboto flex items-center gap-2 cursor-pointer text-base'
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label="Select language"
          >
            {selectedLanguage.name} {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </button>
          {isOpen && (
            <div className='absolute bg-neutral-800 flex flex-col top-10 right-0 border-1 border-orange-300/40 overflow-hidden rounded-xl shadow-orange-200 shadow-xs min-w-40'>
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
        <button 
          onClick={()=>{ navigate('/login') }}
          className='text-[#FFC58D] gap-2 flex items-center cursor-pointer bg-neutral-800 border-1 border-orange-300/60 px-4 py-1.5 rounded-lg shadow-orange-200 shadow-xs '
        >
          Login <FiLogIn size={20}/>
        </button>
      </div>

      {/* mobile toggle */}
      <button
        type='button'
        className='md:hidden inline-flex items-center justify-center rounded-md border-1 border-orange-300/60 px-3 py-2 text-[#FFC58D] bg-neutral-800/70'
        onClick={() => setMobileOpen(v => !v)}
        aria-label='Toggle menu'
        aria-controls='mobile-nav'
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* mobile panel */}
      {mobileOpen && (
        <div id='mobile-nav' className='md:hidden absolute left-0 right-0 top-full mt-2 px-4'>
          <div className='mx-2 rounded-xl border-1 border-orange-300/40 bg-neutral-900/90 backdrop-blur-md p-4 shadow-lg shadow-orange-200/10'>
            <div className='flex flex-col gap-3'>
              <NavLink to='.' end className={({isActive}) => `block px-2 py-1 rounded-md text-[#FFC58D] font-roboto ${isActive ? 'bg-neutral-800/80 font-medium' : 'font-light'}`}>
                Home
              </NavLink>
              <NavLink to='about' className={({isActive}) => `block px-2 py-1 rounded-md text-[#FFC58D] font-roboto ${isActive ? 'bg-neutral-800/80 font-medium' : 'font-light'}`}>
                About
              </NavLink>
              <div className='h-px bg-orange-300/30 my-1' />
              <div className='flex flex-col gap-1'>
                <span className='text-xs text-orange-200/80'>Language</span>
                <div className='flex gap-2'>
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2 py-1 rounded-md border-1 ${selectedLanguage.id === lang.id ? 'border-orange-300/80 bg-neutral-800 text-orange-200' : 'border-orange-300/40 text-[#FFC58D]'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={()=>{ navigate('/login') }}
                className='mt-2 w-full justify-center text-[#FFC58D] gap-2 inline-flex items-center cursor-pointer bg-neutral-800 border-1 border-orange-300/60 px-4 py-2 rounded-lg shadow-orange-200 shadow-xs '
              >
                Login <FiLogIn size={18}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar