import React from 'react'

const HoverMeButton = ({ label = 'Hover' }) => {
  return (
    <div
      role="button"
      aria-label={label}
      tabIndex={0}
      className="group cursor-pointer relative grid place-items-center w-[3.75rem] h-[3.75rem] rounded-full border border-orange-200/80 overflow-hidden
                 transition-transform duration-300 ease-out hover:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/70"
    >
    <div aria-hidden className="absolute inset-0 rounded-full shadow-[0_0_26px_8px_rgba(251,146,60,0.15)] pointer-events-none" />

    <span aria-hidden className="absolute inset-0 rounded-full bg-orange-300/30 animate-ping" />

      <div className='w-10 h-10 rounded-full border border-orange-200/90 flex items-center justify-center relative z-10 bg-transparent'>
        <div className='w-10 h-10 rounded-full border border-transparent flex items-center justify-center'>
          <div className='w-10 h-10 rounded-full border-[3px] border-orange-200 flex items-center justify-center'>
            {/* center spot with its own ping */}
            <div className='relative w-5 h-5'>
              <span aria-hidden className='pointer-events-none absolute inset-0 rounded-full bg-orange-300/30 animate-ping' />
              <div className='bg-orange-200 rounded-full w-full h-full relative z-10' />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-md
                  transition-transform duration-[900ms] ease-out group-hover:translate-x-[180%]"
      />
    </div>
  )
}

export default HoverMeButton