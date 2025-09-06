import React from 'react'
import { IoMdReturnLeft } from "react-icons/io";

const ReturnButton = () => {
  const currentLocation = window.location.pathname;


  if(currentLocation === '/login'){
    return (
    
    <button 
    onClick={() => window.location.href = '/'}
    className="flex cursor-pointer absolute top-5 left-5 items-center text-2xl text-neutral-700 rounded-lg w-10  bg-[#ffcd81] h-10 justify-center hover:text-neutral-600 transition">
      <IoMdReturnLeft  />
    </button>)
  }else{
    return (
      <button 
      onClick={() => window.history.back()}
      className="flex cursor-pointer absolute top-5 left-5 items-center text-2xl text-neutral-700 rounded-lg w-10  bg-[#ffcd81] h-10 justify-center hover:text-neutral-600 transition">
        <IoMdReturnLeft  />
      </button>
    )
  }
}

export default ReturnButton