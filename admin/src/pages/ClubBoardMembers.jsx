import React from 'react'
import useClubsStore from '../store/useClubsStore'
import Error from '../components/Error';
import Loader from '../components/Loader';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardMemberCard from '../components/BoardMemberCard';
const ClubBoardMembers = () => {
  const {clubBoardMembers, boardMembers,error, loading} = useClubsStore();
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();
  useEffect(()=>{
    clubBoardMembers();
  },[clubBoardMembers])
  const filteredMembers = React.useMemo(()=>{
    const q = query.trim().toLowerCase();
    if(!q) return boardMembers;
    return boardMembers.filter(m=>{
      const name = String(m?.fullname || '').toLowerCase();
      const role = String(m?.role || '').toLowerCase();
      const email = String(m?.email || '').toLowerCase();
      return name.includes(q) || role.includes(q) || email.includes(q);
    });
  },[boardMembers, query]);

  
  if(error) return <Error error={error} />
  if(loading) return <Loader />
  
  return (
    <main className='flex flex-col h-screen overflow-y-auto gap-4 px-10 py-8'>
      <div className='flex  w-full justify-between'>
    <h1 className='font-roboto text-3xl text-black font-bold'>Club Board Members: <span className='text-orange-400'>({filteredMembers.length})</span></h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            placeholder="Search for member..."
            className="flex-1 sm:w-64 px-4 py-2 border border-orange-200 focus:border-orange-400 rounded-lg outline-none bg-white text-gray-800 transition"
            type="text"
      value={query}
      onChange={(e)=>setQuery(e.target.value)}
          />
          <button
<<<<<<< HEAD
          onClick={() => navigate("add-edit-board-member")}
=======
          onClick={() => navigate("add-board-member")}
>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
          title="ADD New Board Member"
          className="bg-orange-400 hover:bg-orange-400/80 cursor-pointer text-white px-4 py-2 rounded-lg font-bold text-lg transition">+</button>
        </div>
      </div>
      {
        filteredMembers.length > 0 ?
        ( <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4'>
        {filteredMembers.map((boardMember, index)=>
          <BoardMemberCard 
            boardMember={boardMember}
            key={index}/>
        )}
      </div>):(
        <div className='w-full py-10 flex items-center justify-center'>
          <p className='text-xl font-medium text-gray-700'>No Board Member Found... </p>
        </div>
      )
      }

     
    </main>
  )
}

export default ClubBoardMembers