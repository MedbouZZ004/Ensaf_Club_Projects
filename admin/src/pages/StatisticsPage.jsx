import React from 'react'

const StatisticsPage = () => {
  return (
    <div>
      <h1 className='flex font-robot text-2xl text-orange-300 w-full items-center justify-center font-bold'>
        Statistics
      </h1>
      <div>
        <p className='text-center text-gray-600'>
          Here you can find various statistics related to clubs and their activities.
        </p>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between bg-white p-4 rounded-lg shadow-md'>
            <span className='font-medium text-gray-700'>Total Clubs:</span>
            <span className='font-bold text-gray-900'>10</span>
          </div>
          <div className='flex justify-between bg-white p-4 rounded-lg shadow-md'>
            <span className='font-medium text-gray-700'>Active Members:</span>
            <span className='font-bold text-gray-900'>150</span>
          </div>
          <div className='flex justify-between bg-white p-4 rounded-lg shadow-md'>
            <span className='font-medium text-gray-700'>Events Held:</span>
            <span className='font-bold text-gray-900'>5</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPage