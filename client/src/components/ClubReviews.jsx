import React, { useRef, useState } from 'react'
import { IoIosAdd } from "react-icons/io";
import ReviewCard from './ReviewCard';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import ReviewForm from './ReviewForm';
const ClubReviews = ({reviews = [], club_id}) => {
  const scrollRef = useRef(null)
  const handleScroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const amount = Math.max(300, Math.floor(el.clientWidth * 0.9))
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }
  const [openReviewForm, setOpenReviewForm] = useState(false);
  return (
    <div className='py-10  mt-10 px-10 relative'>
      {openReviewForm && <ReviewForm setOpenReviewForm={setOpenReviewForm} club_id={club_id} />}
      <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-10 w-[50vw] max-w-[340px] h-[50vw] max-h-[340px] rounded-full bg-orange-200/20 blur-[140px]" />
      <h2 className='text-primary font-roboto  text-4xl font-bold mb-4'>CLUB TESTIMONIALS</h2>
      <div className='w-full flex justify-end'>
        <button
          onClick={() => setOpenReviewForm(true)}
          className='text-xl flex hover:bg-orange-300 hover:text-white duration-200 ease-in items-center gap-3 text-neutral-700 px-2 py-2 shadow-md shadow-black/20 bg-background-color rounded-lg font-roboto font-medium cursor-pointer'>
          <IoIosAdd size={30} />
        </button>
      </div>
      <div className='flex items-center scroll justify-between gap-2 mt-3'>
        <button
          type='button'
          aria-label='Scroll reviews left'
          onClick={() => handleScroll(-1)}
          className='grid place-items-center w-10 h-10 rounded-full border border-orange-300/40 text-neutral-800 bg-background-color hover:text-white/80 hover:bg-orange-300 transition'
        >
          <FaAngleLeft />
        </button>
        <div className='flex-1 scroll_reviews overflow-hidden'>
          <div
            ref={scrollRef}
            className='scroll_reviews flex gap-3 bg-amber-100 py-3 items-center overflow-x-auto scroll-smooth'
          >
            {reviews.map(({full_name, email, text, date}) => (
                <ReviewCard 
                  fullName={full_name}
                  email={email}
                  text={text}
                  date={date}
                />
            ))}
          </div>
        </div>
        <button
          type='button'
          aria-label='Scroll reviews right'
          onClick={() => handleScroll(1)}
          className='grid place-items-center w-10 h-10 rounded-full border border-orange-300/40 text-neutral-800 bg-background-color hover:text-white/80 hover:bg-orange-300 transition'
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  )
}

export default ClubReviews