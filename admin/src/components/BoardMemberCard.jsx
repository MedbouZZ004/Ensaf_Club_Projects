import React from 'react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import useClubsStore from '../store/useClubsStore'
const BoardMemberCard = ({ boardMember }) => {
  const {deleteBoardMember} = useClubsStore();
  const navigate = useNavigate();

  return (
    <div className='flex flex-col overflow-hidden  bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border-2 border-orange-400'>
      <div className='relative'>
        <img 
          src={boardMember?.image} 
          alt={boardMember?.fullname} 
          className='w-full h-64'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4'>
          <span className='text-white text-sm font-medium px-3 py-1 bg-orange-400 rounded-full'>
            {boardMember.role}
          </span>
        </div>
      </div>
      
      <div className='p-4 flex flex-col flex-grow'>
        <h3 className='font-bold text-xl text-gray-800 mb-1'>{boardMember.fullname}</h3>
        <p className='text-gray-600 mb-4 flex items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {boardMember.email || 'No email provided'}
        </p>
        
        <div className='mt-auto flex justify-between items-center pt-3 border-t border-gray-100'>
          <div className='flex space-x-2'>
<<<<<<< HEAD
            <button onClick={()=> navigate(`/club-board-members/add-edit-board-member?memberId=${boardMember.id}`)} title='Edit Member' className='p-2 rounded-full bg-blue-100 text-blue-600 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200'>
=======
            <button onClick={()=> navigate(`/club-board-members/add-board-member?memberId=${boardMember.id}`)} title='Edit Member' className='p-2 rounded-full bg-blue-100 text-blue-600 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200'>
>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
              <FaEdit className='text-sm' />
            </button>
            <button 
            onClick={()=> deleteBoardMember(boardMember.id)}
            title='Delete Member' className='p-2 rounded-full bg-red-100 text-red-600 cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200'>
              <FaTrash className='text-sm' />
            </button>
          </div>
          
          <span className='text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600'>
            ID: {boardMember.id || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default BoardMemberCard