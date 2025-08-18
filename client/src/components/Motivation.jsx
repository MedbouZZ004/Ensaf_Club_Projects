import React from 'react'
import { motion as Motion } from 'framer-motion'
import QuotesCard from './QuotesCard';
import { amazingMomPictures } from '../utils';


const Motivation = () => {
  const duration = 15;
  return (
    <div className='min-h-screen px-10 flex flex-col gap-13 py-10 bg-[#ffe8c7]'>
      {/* First content  : */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-8">
        <Motion.div
          className='w-full lg:w-[40%]  flex flex-col gap-4'
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.6 }}
        >
          <h1 className="font-roboto text-black/80 text-5xl font-bold text-wrap w-[100%]">UNFORGOTTEN MOMENT OF EFC</h1>
          <p className="font-roboto text-md w-[80%] text-black/60">With <span className='font-medium'>EFC</span>, we create memories that last a lifetime & inspire each other to reach new heights — through events, workshops, and shared projects that grow our skills, build friendships, & celebrate collaboration. Every moment is a chance to learn, lead, & belong.</p>
        </Motion.div>
        <Motion.div
          className='w-full lg:w-[60%]'
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.6 }}
        >
          <div className='relative w-full overflow-hidden'>
            <Motion.div
              className='flex w-full items-center gap-1'
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
              style={{ willChange: 'transform' }}
            >
              {[...amazingMomPictures, ...amazingMomPictures].map((src, idx) => (
                <div
                  key={`${src}-${idx}`}
                  className='shrink-0 w-86 h-full  overflow-hidden bg-white shadow-sm ring-1 ring-black/5'
                >
                  <img
          src={src}
          alt={`EFC moment ${idx % amazingMomPictures.length + 1}`}
                    className='w-full h-full object-cover'
                  />
                </div>
              ))}
            </Motion.div>
            {/* Minor edge blur overlays for a softer look */}
            <div className='pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-gray-300 to-transparent backdrop-blur-sm' />
            <div className='pointer-events-none absolute inset-y-0 right-0  w-3 bg-gradient-to-l from-gray-300 to-transparent backdrop-blur-sm' />
          </div>
        </Motion.div>
      </div>

      {/* Second content  : */}
      <div className='w-full flex items-center gap-4'>
      
        <QuotesCard />
        <Motion.div
          className='w-full lg:w-[60%] lg:ml-28 gap-8 items-start flex'
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Decorative timeline accent */}
          <div className='flex flex-col items-center pt-2'>
            <div className='w-4 h-4 rounded-full bg-black/80 ring-4 ring-black/10 shadow-md animate-pulse'/>
            <div className='mt-2 h-56 w-[3px] bg-gradient-to-b from-black/70 via-black/40 to-transparent rounded-full'/>
          </div>
          {/* Content card */}
          <Motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className='relative'
          >
            <h1 className='font-roboto text-black/80 text-4xl md:text-5xl font-bold'>ABOUT EFC</h1>
            <p className='mt-4 font-roboto text-[15px] md:text-md leading-relaxed text-black/70 max-w-[60ch]'>
              ENSA Fès Clubs (EFC) is a central hub that showcases all student clubs at ENSA Fès.
              It helps students quickly discover clubs through simple search and clear categories,
              and provides key details about each club—its activities, goals, events, and how to join, 
              so everyone can find the right community and get involved.
            </p>
          </Motion.div>
        </Motion.div>
      </div>
      
    </div>
  )
}

export default Motivation