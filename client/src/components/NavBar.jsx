import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiLogIn } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
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
  return (
    <nav className="relative flex justify-between px-6 py-4">
      <Link to="." end>
        <img className='w-20' src="/logo.png" alt="Logo" />
      </Link>
      <div className='flex w-[60%] items-center justify-between'>
        <NavLink to="." end className={({isActive}) => `text-[#FFC58D] font-roboto  text-xl ${isActive ? 'font-medium':'font-light'}`}>
          Home
        </NavLink>
        <NavLink to="about" className={({isActive}) => `text-[#FFC58D] font-roboto  text-xl ${isActive ? 'font-medium':'font-light'}`}>
          About
        </NavLink>
        <button className='text-[#FFC58D] font-roboto  flex items-center gap-3 cursor-pointer relative text-lg' onClick={() => setIsOpen(!isOpen)}>
          {selectedLanguage.name} {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </button>
        {isOpen && 
          <div className='absolute bg-neutral-800   flex flex-col top-15 right-70 border-1 border-orange-300/40 overflow-hidden rounded-xl shadow-orange-200 shadow-xs'>
            {languages.map(lang => (
              <button 
              onClick={()=>{
                setSelectedLanguage(lang);
                setIsOpen(false);
              }}
              key={lang.id} className='text-white hover:bg-gray-700 px-7 py-2 cursor-pointer w-full'>
                {lang.name}
              </button>
            ))}
          </div>
        }
        <button 
        onClick={()=>{ navigate('/login') }}
        className='text-[#FFC58D] gap-3 flex items-center cursor-pointer bg-neutral-800 border-1 border-orange-300/60 px-4 py-1.5 rounded-lg shadow-orange-200 shadow-xs '>
          Login <FiLogIn size={20}/>
        </button>
      </div>
    </nav>
  );
}

export default NavBar