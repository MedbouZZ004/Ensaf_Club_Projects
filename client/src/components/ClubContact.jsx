import React from 'react'
import ContactAnimation from './ContactAnimation'
import ContactForm from './ContactForm'
const ClubContact = ({admin_id}) => {
  return (
    <div className='relative min-h-screen px-4 sm:px-6 md:px-10 py-8 md:py-12'>
      <div aria-hidden className="pointer-events-none absolute -top-16 -left-10 w-[50vw] max-w-[240px] h-[50vw] max-h-[240px] rounded-full bg-orange-200/20 blur-[140px]" />
      <div className='max-w-6xl mx-auto flex flex-col gap-6 md:gap-10'>
        <h1 className='text-primary font-roboto font-bold text-3xl sm:text-4xl text-center'>
          CONTACT US
        </h1>
        <div className='w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-6 sm:gap-8 md:gap-10'>
          <div className='w-full md:w-1/2 max-w-md md:max-w-none mx-auto'>
            <ContactAnimation />
          </div>
          <div className='w-full md:w-1/2 md:mr-10'>
            <ContactForm admin_id={admin_id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubContact