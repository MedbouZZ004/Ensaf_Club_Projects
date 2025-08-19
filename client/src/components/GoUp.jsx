import React from 'react'
import { FaAngleDoubleUp } from "react-icons/fa";

const GoUp = () => {
  const goToHero = () => {
    const el = document.getElementById('hero');
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <button
      type='button'
      onClick={goToHero}
      aria-label='Go to top section'
      title='Go to top'
      className='fixed bottom-6 right-6 z-50 cursor-pointer p-3 rounded-full bg-orange-200 text-neutral-700 mb-3 shadow-lg border border-orange-200 hover:bg-orange-200/90 active:scale-95 transition'
    >
      <FaAngleDoubleUp className='w-5 h-5' />
    </button>
  )
}

export default GoUp