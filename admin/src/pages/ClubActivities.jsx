import React from 'react'
import useClubsStore from '../store/useClubsStore'
import Error from '../components/Error';
import Loader from '../components/Loader';
import { useEffect } from 'react';
import ActivityCard from '../components/ActivityCard';
import { useNavigate } from 'react-router-dom';
import { useActionState } from 'react';

const ClubActivities = () => {
  const {clubActivities,activities ,loading, error} = useClubsStore();
  const [query, setQuery] = React.useState('');
  const navigate =  useNavigate();
  
  


  useEffect(()=>{
    clubActivities()
  },[clubActivities]);

  const filteredActivities = React.useMemo(()=>{
    const q = query.trim().toLowerCase();
    if(!q) return activities;
    return activities.filter(a=>{
      const name = String(a?.name || '').toLowerCase();
      const pitch = String(a?.pitch || '').toLowerCase();
      const dateStr = String(a?.activity_date || '').toLowerCase();
      return name.includes(q) || pitch.includes(q) || dateStr.includes(q);
    });
  },[activities, query]);

  if(error) return <Error error={error} />
  if(loading) return <Loader  />


  return (
    <main className='flex flex-col gap-4 overflow-y-auto px-10 py-10'>
      <div className='flex  w-full justify-between'>
    <h1 className='font-roboto text-3xl text-black font-bold'>Club Activities <span className='text-orange-400'>({filteredActivities.length})</span></h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            placeholder="Search for activity..."
            className="flex-1 sm:w-64 px-4 py-2 border border-orange-200 focus:border-orange-400 rounded-lg outline-none bg-white text-gray-800 transition"
            type="text"
      value={query}
      onChange={(e)=>setQuery(e.target.value)}
          />
          <button
          onClick={()=>navigate('/club-activities/add-edit-activity')}
          title="ADD Activity"
          className="bg-orange-400 hover:bg-orange-400/80 cursor-pointer text-white px-4 py-2 rounded-lg font-bold text-lg transition">+</button>
        </div>
      </div>
      {
      filteredActivities.length > 0 ? 
      (   
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4'>
          {
        filteredActivities.map((activity, index)=>
              <ActivityCard  key={index} activity={activity}/>
            )
          }
      </div>
      ): (
        <div className='w-full py-10 flex items-center justify-center'>
          <p className='text-xl font-medium text-gray-700'>No Activity Found... </p>
        </div>
      )}
    </main>
  
  )
}

export default ClubActivities