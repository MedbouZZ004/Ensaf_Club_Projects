import React from 'react'
import Ping from './Ping'
const Views = ({views}) => {
  return (
    <div className='text-white relative w-28 h-10 border border-primary/40 bg-neutral-800 rounded-lg flex items-center justify-center'>
        <Ping />
        <h1 className='font-roboto  w-full justify-center gap-2 flex items-center text-xl '>
            <span className='text-primary'>{views}</span> views
        </h1>
    </div>
  )
}

export default Views