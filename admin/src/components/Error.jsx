import React from 'react'
const Error = ({error}) => {
  return (
     <div className='h-screen w-full flex items-center justify-center text-red-500 text-2xl font-medium font-roboto'>{error}</div>
  )
}

export default Error