import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import useClubsStore from '../store/useClubsStore';
import { useNavigate } from 'react-router-dom';
const ActivityCard = ({ activity }) => {
  const { deleteActivity } = useClubsStore();
  const navigate = useNavigate();
  return (
    <div className='overflow-hidden rounded-xl shadow-sm transition-all duration-300  border border-orange-400/70 bg-white'>
      <div className='relative'>
        <img 
          className='w-full h-72  transition-transform duration-500 hover:scale-105' 
          src={activity.main_image} 
          alt={activity.name} 
        />
        <div className='absolute top-3 right-3 bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium'>
          {activity.activity_date.split('T')[0]}
        </div>
      </div>
      
      <div className='p-4'>
        <h1 className='font-bold text-xl text-black mb-2 line-clamp-1'>{activity.name}</h1>
        
        <div className='flex items-center justify-between border-t border-orange-100 pt-3'>
          <div className='flex space-x-3'>
            <button 
             onClick={()=> navigate(`details/${activity.activity_id}`)}
             title='View Activity' className='p-2 rounded-full bg-orange-400/30 text-orange-500 cursor-pointer hover:text-white hover:bg-orange-400 transition-colors duration-200'>
              <FaEye className='text-sm' />
            </button>
            <button  
            onClick={()=> navigate(`add-edit-activity?id=${activity.activity_id}`)}
            title='Edit Activity' className='p-2 rounded-full bg-sky-400/30 text-sky-500 cursor-pointer hover:bg-sky-400 hover:text-white transition-colors duration-200'>
              <FaEdit className='text-sm' />
            </button>
            <button 
            onClick={()=> deleteActivity(activity.activity_id)}
            title='Delete Activity' className='p-2 rounded-full bg-red-400/30 cursor-pointer text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200'>
              <FaTrash className='text-sm' />
            </button>
          </div>
          
          <span className='text-xs font-medium px-2 py-1 rounded-md bg-orange-400 text-white'>
            {"Activity"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ActivityCard