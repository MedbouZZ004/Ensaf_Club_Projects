import React from 'react'
import ContactAnimation from './ContactAnimation'
import ContactForm from './ContactForm'
const ClubContact = ({admin_id}) => {
  return (
    <div className='px-10 py-10 relative flex flex-col gap-10 min-h-screen'>
      <div aria-hidden className="pointer-events-none absolute -top-16 -left-10 w-[50vw] max-w-[240px] h-[50vw] max-h-[240px] rounded-full bg-orange-200/20 blur-[140px]" />
      <h1  className='text-primary  font-roboto font-bold text-3xl md:text-4xl w-full text-center '>CONTACT US</h1>
      <div className='w-full relative justify-center items-center  flex gap-2'>
        <div className='w-[60%]'>
          <ContactAnimation />
        </div>
        <div className='w-[40%] mr-20'>
          <ContactForm admin_id={admin_id} />
        </div>
      </div>
    </div>
  )
}

export default ClubContact