import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaQrcode } from "react-icons/fa6";
import { IoMdArrowDropdownCircle } from "react-icons/io";

const HeroSection = () => {
  const teamWorkImages = [
    '/team-work-1.jpg',
    '/team-work-2.jpg',
    '/team-work-3.jpg',
    '/team-work-4.jpg',
    '/team-work-5.jpg'
  ];
  const [teamIdx, setTeamIdx] = React.useState(0);
  const [direction, setDirection] = React.useState(0); 
  const [paused, setPaused] = React.useState(false);

  const nextTeam = React.useCallback(() => {
    if (!teamWorkImages.length) return;
    setDirection(1);
    setTeamIdx((i) => (i + 1) % teamWorkImages.length);
  }, [teamWorkImages.length]);

  const prevTeam = React.useCallback(() => {
    if (!teamWorkImages.length) return;
    setDirection(-1);
    setTeamIdx((i) => (i - 1 + teamWorkImages.length) % teamWorkImages.length);
  }, [teamWorkImages.length]);

  // autoplay when not interacting
  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      nextTeam();
    }, 3500);
    return () => clearInterval(id);
  }, [paused, nextTeam]);

  const handleScrollToSearch = (e) => {
    e.preventDefault();
    const el = document.getElementById('search');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <section id='hero' className='relative isolate overflow-hidden min-h-screen flex items-center flex-col gap-6 px-2 sm:px-4 md:px-10 py-8 md:py-10'>
      <div
        aria-hidden
        className='pointer-events-none absolute z-0 top-120 right-50 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[250px] h-[70vw] max-h-[250px] bg-orange-200/30 rounded-full blur-[130px]'
      />
      <motion.div
        className='flex w-full justify-center items-center text-center'
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .7, ease: 'easeIn' }}
      >
        <h1 className='text-[#fed0a4] text-2xl xs:text-3xl sm:text-4xl md:text-7xl font-bold font-roboto leading-tight'>GROW UP WITH YOUR PEERS.</h1>
      </motion.div>

  <div className='relative z-10 flex w-full flex-col gap-6'>
        {/* first content. */}
        <div className='flex w-full mt-4 gap-4 flex-col lg:flex-row justify-between items-center'>
          <motion.div
            className='w-full lg:w-[40%] relative flex rounded-xl min-h-[180px] sm:min-h-[220px] md:h-70 bg-[#ffdbb9] mb-4 md:mb-0'
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeIn' }}
          >
            <h3 className='text-4xl  xs:text-3xl  md:text-[3.3rem] lg:text-6xl font-roboto w-[80%] py-3 px-2 sm:px-4 md:px-8 text-black/80 font-light'>
              <span className='font-medium'>We</span> <br />
              Make-<br />
              Your Search
              <span className='font-medium'> Easier</span>
              <a href='#search' onClick={handleScrollToSearch} className='text-neutral-900/90 ml-3 hover:text-neutral-800/80 cursor-pointer duration-200 '>
                <IoMdArrowDropdownCircle className='inline-block' />
              </a>
            </h3>
            <img className='absolute  w-28.5 sm:w-30 md:w-50 -top-4 xs:-top-8 md:-top-16 rotate-10 -right-2 xs:-right-6 md:-right-5' src="/search.png" alt="" />
          </motion.div>

          <motion.div
            className='w-full lg:w-[40%] z-1000 relative flex rounded-xl min-h-[180px] sm:min-h-[220px] md:h-70 bg-[#3C3B39]'
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeIn', delay: 0.2 }}
          >
            <h3 className='text-4xl  xs:text-3xl  md:text-[3.3rem] lg:text-6xl px-2 sm:px-4 md:px-10 py-3 w-[80%] font-roboto font-light text-[#ffcea0]'>
              Share <br />
              Your Ideas <br />
              and-<br />
              <span className='font-medium'>Thrive On</span>
            </h3>
            <img className='absolute w-30 sm:w-24 md:w-50 -right-2 xs:-right-6 md:-right-10' src="/light.png" alt="" />
          </motion.div>
        </div>

        <div className='w-full flex flex-col-reverse lg:flex-row gap-4 justify-between items-start'>
          <motion.div
            className="relative w-full lg:w-[40%] flex gap-4"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeIn', delay: 0.3 }}
          >

            <div className='flex flex-col gap-3 w-1/2 h-80'>

              <motion.div
                className='relative w-full h-40 rounded-xl overflow-hidden border border-orange-300/60 bg-gradient-to-br from-[#ffdbb9]/70 via-[#ffd7ad]/70 to-[#ffc690]/80 p-3 shadow-lg shadow-orange-200/10'
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <div aria-hidden className='pointer-events-none absolute -top-8 -left-8 w-32 h-32 rounded-full bg-orange-300/50 blur-[70px]' />
                <h3 className='font-roboto text-white font-bold text-lg md:text-2xl'>+10 Clubs Added</h3>
                <p className='mt-1 text-gray-100 text-sm  sm:text-md leading-snug'>
                  <span className='font-medium'>New clubs</span> have been added to the platform, expanding your opportunities to connect and collaborate with peers.
                </p>
                {/* sheen */}
                <motion.div
                  aria-hidden
                  className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md"
                  initial={{ x: 0 }}
                  whileHover={{ x: '160%' }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              </motion.div>

              {/* qr card */}
              <motion.div
                className='relative w-full h-40 rounded-xl border border-orange-300/50 bg-[#ffdbb9]/30 flex flex-col items-center justify-center p-3'
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <div aria-hidden className='absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] tracking-wide bg-orange-200/70 text-black/80 border border-orange-300/60'>QR</div>
                <FaQrcode className='text-white' size={120} />
                <span className='mt-2 md:text-md text-sm text-white/80'>Scan to join and explore</span>
              </motion.div>
            </div>

            <motion.div
              className="relative w-1/2 h-80 bg-neutral-800/60 backdrop-blur-md rounded-xl p-4 flex flex-col items-center justify-center border border-orange-300/40 shadow-lg shadow-orange-200/10 overflow-hidden"
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div aria-hidden className='pointer-events-none absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-orange-200/20 blur-[90px]' />
              <motion.img
                src="/logo.png"
                alt="ENSA Fes Clubs logo"
                loading="lazy"
                className='w-34 h-auto drop-shadow'
                whileHover={{ scale: 1.05, rotate: -1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <h2 className='mt-2 text-[#e9ba78] font-roboto font-bold text-lg md:text-xl'>ENSA FES CLUBS</h2>
              <div aria-hidden className='absolute inset-0 rounded-xl ring-1 ring-inset ring-orange-300/20' />
            </motion.div>
          </motion.div>

          <motion.div
            className='w-full lg:w-[40%] h-58 sm:h-60 md:h-80 flex gap-2'
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeIn', delay: 0.4 }}
          >
            <div className='relative h-full w-full'>
              
              <div
                className='group w-full h-full border-1 rounded-xl border-orange-300/50 overflow-hidden relative'
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <div className='absolute z-30 top-2 left-2 flex flex-col gap-2 p-1 rounded-xl bg-neutral-900/40 backdrop-blur-sm border border-orange-300/30 shadow-lg shadow-orange-200/10'>
                  <button
                    type="button"
                    aria-label="Scroll up"
                    title="Scroll up"
                    onClick={prevTeam}
                    className='w-10 h-10 cursor-pointer md:w-11 md:h-11 rounded-full flex items-center justify-center text-orange-200 bg-gradient-to-b from-orange-200/20 to-transparent border border-orange-300/40 hover:from-orange-200/30 hover:bg-orange-200/10 transition transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60'
                  >
                    <IoIosArrowUp className='w-5 h-5 md:w-6 md:h-6' />
                  </button>
                  <button
                    type="button"
                    aria-label="Scroll down"
                    title="Scroll down"
                    onClick={nextTeam}
                    className='w-10 h-10 cursor-pointer md:w-11 md:h-11 rounded-full flex items-center justify-center text-orange-200 bg-gradient-to-b from-orange-200/20 to-transparent border border-orange-300/40 hover:from-orange-200/30 hover:bg-orange-200/10 transition transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60'
                  >
                    <IoIosArrowDown className='w-5 h-5 md:w-6 md:h-6' />
                  </button>
                </div>

                <div className='absolute inset-0'>
                  <AnimatePresence mode='wait' initial={false}>
                    <motion.img
                      key={teamIdx}
                      src={teamWorkImages[teamIdx]}
                      alt={`Team work ${teamIdx + 1}`}
                      className='w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105'
                      initial={{ opacity: 0, x: direction === 1 ? 40 : -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction === 1 ? -40 : 40 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  </AnimatePresence>
                </div>

                <div aria-hidden className='pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent' />
                  <div className='absolute z-20 border-1 border-orange-300/40 bg-black/50 p-2 rounded-lg left-3 bottom-3 sm:left-4 sm:bottom-4 max-w-[85%]'>
                    <h4 className='font-roboto font-semibold text-orange-300 text-sm sm:text-base md:text-lg tracking-wide'>Teamwork</h4>
                    <p className='font-roboto text-white/80 font-sans text-lg sm:text-sm'>Collaborate, create, and grow together with ENSA Fes clubs.</p>
                  </div>
              </div>
            </div>
          </motion.div>
        </div>
  </div>
    </section>
  );
}

export default HeroSection