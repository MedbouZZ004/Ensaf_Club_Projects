import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import Titre from './Titre'
const MotionDiv = motion.div

const ClubImages = ({ club_images = [], speed = 40, direction = 'left', className = '' }) => {
  const trackRef = useRef(null)
  const cycleRef = useRef(null)
  const [cycleWidth, setCycleWidth] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0)
  // Measure width of one cycle
  useLayoutEffect(() => {
    if (!cycleRef.current) return
    const measure = () => {
      const w = cycleRef.current.scrollWidth || 0
      setCycleWidth(w)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(cycleRef.current)
    return () => ro.disconnect()
  }, [club_images])

  // Auto-scroll animation
  useAnimationFrame((t, delta) => {
    if (!cycleWidth || isHovered) return
    const dir = direction === 'left' ? -1 : 1
    let next = x.get() + dir * speed * (delta / 1000)
    if (direction === 'left') {
      if (next <= -cycleWidth) next += cycleWidth
    } else {
      if (next >= 0) next -= cycleWidth
    }
    x.set(next)
  })

  // Ensure x stays within loop range
  useEffect(() => {
    if (!cycleWidth) return
    const cur = x.get()
    if (cur <= -cycleWidth) x.set(cur + cycleWidth)
    if (cur >= 0) x.set(cur - cycleWidth)
  }, [cycleWidth, direction, x])

  if (!club_images || club_images.length === 0) return null

  const imagesTwice = [...club_images, ...club_images]
  return (
    <section
      className={`relative w-full  py-10 text-white overflow-hidden ${className}`}
      aria-label="Club images ticker"
    > 
      <div className="relative">
        <div 
          aria-hidden 
          className="pointer-events-none absolute inset-y-0 left-0 w-20 z-20 bg-gradient-to-r from-black/90 via-black/80 to-transparent" 
        />
        <div 
          aria-hidden 
          className="pointer-events-none absolute inset-y-0 right-0 w-32 z-20 bg-gradient-to-l from-black/90 via-black/80 to-transparent" 
        />
        
        {/* Decorative elements */}

        <MotionDiv
          ref={trackRef}
          className="relative"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Measuring cycle */}
          <div ref={cycleRef} className="absolute -z-10 opacity-0 pointer-events-none whitespace-nowrap">
            <div className="flex gap-6">
              {club_images.map((src, idx) => (
                <img key={`measure-${idx}`} src={src} alt="" className="h-52 w-auto rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Draggable marquee track */}
          <MotionDiv
            drag="x"
            dragConstraints={{ left: -Infinity, right: Infinity }}
            dragElastic={0.02}
            style={{ x }}
            className="flex gap-2 items-center cursor-grab active:cursor-grabbing"
            onDragStart={() => setIsHovered(true)}
            onDragEnd={() => setIsHovered(false)}
          >
            {imagesTwice.map((src, idx) => (
              <motion.div
                key={idx}
                className="group relative shrink-0 rounded-sm overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 border border-orange-300/30 backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <img
                  src={src}
                  alt={`Club Image ${idx % club_images.length + 1}`}
                  className="object-cover w-90 h-80 select-none pointer-events-none transition-all duration-500 ease-out group-hover:scale-110"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
                  <div className="text-center w-full">
                    <h1 className="text-amber-200 text-lg">Join us today!</h1>
                  </div>
                </div>
                
                <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-amber-400 "></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-amber-400 "></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-amber-400 "></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-amber-400 "></div>
              </motion.div>
            ))}
          </MotionDiv>
        </MotionDiv>
      </div>
      
      {/* Instructions */}
      <div className="text-center mt-8 text-gray-400">
        <p className="flex items-center justify-center gap-2">
          <span className="inline-block animate-bounce">←→</span>
          Drag to explore more images
        </p>
      </div>
    </section>
  )
}

export default ClubImages