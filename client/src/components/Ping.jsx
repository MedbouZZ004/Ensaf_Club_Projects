import React from 'react'

const Ping = () => {
  return (
    <div className="absolute w-4 h-4 bottom-8 -left-1">
      {/* Pinging ring */}
      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping" />
      {/* Stable center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className='w-3 h-3 bg-green-600 rounded-full' />
      </div>
    </div>
  )
}

export default Ping