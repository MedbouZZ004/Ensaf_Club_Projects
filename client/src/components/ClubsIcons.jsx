import React, { useMemo, useState } from 'react'
import HoverMeButton from './HoverMeButton'
import { motion as Motion } from 'framer-motion'
import { tgd, futurePioneers, ieee, robogenius, rotaract, secOps, space, teatro } from '../utils';
import { PiArrowBendDoubleUpRightFill } from "react-icons/pi";

const ClubsIcons = () => {
  const [open, setOpen] = useState(false);
  const icons = useMemo(() => [
    { src: tgd, alt: 'TGD' },
    { src: futurePioneers, alt: 'Future Pioneers' },
    { src: ieee, alt: 'IEEE' },
    { src: robogenius, alt: 'RoboGenius' },
    { src: rotaract, alt: 'Rotaract' },
    { src: secOps, alt: 'SecOps' },
    { src: space, alt: 'Space' },
    { src: teatro, alt: 'Teatro' },
  ], []);

  const baseRadius = 200; // default radius

  return (
    <div className='relative z-100 px-10 flex items-center justify-center'>
      <div
        aria-hidden
        className='-left-50 bottom-100  pointer-events-none absolute z-10  translate-x-1/2  w-[70vw] max-w-[250px] h-[70vw] max-h-[250px] bg-orange-200/40 rounded-full blur-[160px]'
      />
      <div
        aria-hidden
        className='-right-0 bottom-130  pointer-events-none absolute z-100  w-[70vw] max-w-[250px] h-[70vw] max-h-[250px] bg-orange-200/40 rounded-full blur-[160px]'
      />
      <div className='relative w-80 h-80 md:w-96 md:h-96'>
        {/* Icon ring (absolute, centered) */}
        {icons.map((icon, i) => {
          const angle = (i / icons.length) * Math.PI * 2; // radians
          const x = Math.cos(angle) * baseRadius;
          const y = Math.sin(angle) * baseRadius;
          return (
            <Motion.div
              key={icon.alt}
              className='absolute left-1/2 top-1/2'
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.85 }}
              animate={{
                x: open ? x : 0,
                y: open ? y : 0,
                opacity: open ? 1 : 0,
                scale: open ? 1 : 0.85,
              }}
              transition={{ type: 'spring', stiffness: 140, damping: 18, mass: 0.7, delay: open ? i * 0.03 + 0.05 : 0 }}
              style={{ translateX: '-50%', translateY: '-50%' }}
            >
              <div className='w-15 h-15 md:w-30 md:h-30 rounded-full border-2 border-orange-300/70  shadow-xs  shadow-orange-200/80 overflow-hidden'>
                <img src={icon.src} alt={icon.alt} className='w-full h-full  rounded-full' />
              </div>
            </Motion.div>
          )
        })}

        {/* Center button (hover to open/close) */}
        <div
          className='group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          {/* Hint overlay (keeps same positions, animated, non-blocking) */}
          <Motion.div
            aria-hidden
            className='absolute inset-0 pointer-events-none'
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: open ? 0 : 1, y: open ? -4 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h1 className='text-[#ffcf9c] drop-shadow-md font-roboto font-medium text-3xl absolute left-30 rotate-30 w-50 bottom-4 select-none'>
              Hover Here!
            </h1>
            <Motion.div
              className='absolute left-20 rotate-200'
              animate={open ? { y: 0} : { y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: open ? 0 : Infinity, ease: 'easeInOut' }}
            >
              <PiArrowBendDoubleUpRightFill className='text-orange-200 text-8xl' />
            </Motion.div>
          </Motion.div>

          <HoverMeButton label={open ? 'Close' : 'Open'} />
        </div>
      </div>
    </div>
  )
}


export default ClubsIcons