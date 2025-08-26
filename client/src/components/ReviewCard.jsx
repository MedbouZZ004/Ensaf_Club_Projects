import React from 'react';
import { WiStars } from "react-icons/wi";

const ReviewCard = ({ fullName, email, text, date }) => {
  const firstNameLetter = fullName.charAt(0).toUpperCase();
  
  // Generate a consistent color based on the first letter
  const colorMap = {
    'A': 'bg-red-500',
    'B': 'bg-blue-500',
    'C': 'bg-green-500',
    'D': 'bg-yellow-500',
    'E': 'bg-purple-500',
    'F': 'bg-pink-500',
    'G': 'bg-indigo-500',
    'H': 'bg-teal-500',
    'I': 'bg-orange-500',
    'J': 'bg-red-600',
    'K': 'bg-blue-600',
    'L': 'bg-green-600',
    'M': 'bg-yellow-600',
    'N': 'bg-purple-600',
    'O': 'bg-pink-600',
    'P': 'bg-indigo-600',
    'Q': 'bg-teal-600',
    'R': 'bg-orange-600',
    'S': 'bg-red-700',
    'T': 'bg-blue-700',
    'U': 'bg-green-700',
    'V': 'bg-yellow-700',
    'W': 'bg-purple-700',
    'X': 'bg-pink-700',
    'Y': 'bg-indigo-700',
    'Z': 'bg-teal-700'
  };
  
  const bgColor = colorMap[firstNameLetter] || 'bg-primary';

  return (
    <div className='p-4 h-60 w-100 border-neutral-200  rounded-xl border-2  shadow-md shadow-black/20 bg-background-color transition-all duration-300 hover:-translate-y-1'>
      {/* Header with avatar and info */}
      <div className='flex  gap-4 '>
        <div className={`flex-shrink-0 shadow-xs shadow-gray-400 text-white w-12 h-12 rounded-full ${bgColor} flex items-center justify-center  font-bold text-lg`}>
          {firstNameLetter}
        </div>
        
        <div className='flex-1 min-w-0'>
          <div className='flex justify-between items-start'>
            <div>
              <h3 className='text-neutral-900 font-roboto font-semibold text-lg truncate'>{fullName}</h3>
              <p className='text-neutral-600 font-roboto text-sm truncate'>{email}</p>
            </div>
           
          </div>
           
            <div className='text-sm mt-2 text-neutral-800 flex items-center gap-1'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{date.split(' ')[0]}</span>
            </div>
        </div>
      </div>
      
      <div className='relative rounded-md flex items-center justify-center'>
        <p className='text-neutral-900 flex gap-2 font-medium font-roboto text-base items-center leading-relaxed'>
          <WiStars className='text-4xl text-amber-700' />
          <span className='flex-1'>{text.slice(0, 60)}
            {text.length > 60 && 
            <button 
            onClick={() => alert(text)}
            className='text-amber-700 curosr-pointer hover:underline duration-150'>...read more</button>}</span>
          <WiStars className='text-4xl text-amber-700' />
        </p>
      </div>
      
    </div>
  );
};

export default ReviewCard;