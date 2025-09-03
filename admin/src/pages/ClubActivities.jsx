import React from 'react'
import useClubsStore from '../store/useClubsStore'
import Error from '../components/Error';
import Loader from '../components/Loader';
import { useEffect } from 'react';
import ActivityCard from '../components/ActivityCard';
import { useNavigate } from 'react-router-dom';

const ClubActivities = () => {
  const {clubActivities,activities ,loading, error} = useClubsStore();
  const navigate =  useNavigate();
  
  useEffect(()=>{
    clubActivities()
  },[clubActivities]);

  if(error) return <Error error={error} />
  if(loading) return <Loader  />


  return (
    <main className='flex flex-col gap-4 overflow-y-auto px-10 py-10'>
      <div className='flex  w-full justify-between'>
        <h1 className='font-roboto text-3xl text-black font-bold'>Club Activities <span className='text-orange-400'>({activities.length})</span></h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            placeholder="Search for club..."
            className="flex-1 sm:w-64 px-4 py-2 border border-orange-200 focus:border-orange-400 rounded-lg outline-none bg-white text-gray-800 transition"
            type="text"
          />
          <button
          onClick={()=>navigate('/club-activities/add-activity')}
          title="ADD CLUB"
          className="bg-orange-400 hover:bg-orange-400/80 cursor-pointer text-white px-4 py-2 rounded-lg font-bold text-lg transition">+</button>
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4'>
        {
          activities.map((activity, index)=>
            <ActivityCard  key={index} activity={activity}/>
          )
        }
      </div>
    </main>
  
  )
}

export default ClubActivities