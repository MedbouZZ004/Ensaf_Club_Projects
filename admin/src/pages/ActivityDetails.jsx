import useClubsStore from '../store/useClubsStore'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Error from '../components/Error'
import Loader from '../components/Loader'
import { FaArrowLeft, FaCalendarAlt, FaImages } from 'react-icons/fa'

const ActivityDetails = () => {
    const { activityId } = useParams()
    const { activities, loading, error, clubActivities } = useClubsStore();
    const activity = activities.find(act => act.activity_id === parseInt(activityId))
    const [selectedImage, setSelectedImage] = useState(activity?.activity_images?.[0]);
    
    useEffect(() => {
        clubActivities();
    }, [activityId, clubActivities])
    
    if (error) return <Error error={error} />
    if (loading) return <Loader />
    
    if (!activity) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Activity Not Found</h2>
                    <p className="text-gray-600 mt-2">The requested activity could not be found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className='px-6 py-6  h-screen overflow-y-auto '>
            {/* Header with back button */}
            <div className='mb-6'>
                <button 
                    onClick={() => window.history.back()}
                    className='flex text-xl items-center text-orange-400 hover:text-orange-500 transition-colors duration-200 font-medium'
                >
                    <FaArrowLeft className='mr-2' />
                    Back to Activities
                </button>
            </div>
            
            <div className='bg-white border border-orange-400 rounded-xl shadow-md overflow-hidden'>
                {/* Activity header */}
                <div className='p-6 border-b border-gray-200'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>{activity.name}</h1>
                    <div className='flex items-center text-gray-600'>
                        <FaCalendarAlt className='mr-2 text-orange-400' />
                        <span className='font-semibold' >{new Date(activity.activity_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                </div>
                
                {/* Main content area */}
                <div className='p-6'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10'>
                        <div className='rounded-lg shadow-gray-400 shadow-sm overflow-hidden'>
                            <img 
                                className='w-full h-96 shadow-gray-400 shadow-sm' 
                                src={activity.main_image} 
                                alt={activity.name} 
                            />
                        </div>
                        
                        <div className='flex flex-col justify-center'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4'>About This Activity</h2>
                            <p className='text-gray-700 leading-relaxed'>{activity.pitch}</p>
                            
                            <div className='mt-6 p-4 bg-orange-50 rounded-lg border border-orange-100'>
                                <h3 className='font-medium text-orange-800 mb-2'>Activity Information</h3>
                                <div className='grid grid-cols-2 gap-3 text-sm'>
                                    <div>
                                        <span className='text-gray-700'>Status:</span>
                                        <span className='ml-2 font-medium text-green-600'>Completed</span>
                                    </div>
                    
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Image gallery section */}
                    <div className='border-t border-gray-200 pt-8'>
                        <div className='flex items-center mb-6'>
                            <FaImages className='text-2xl text-orange-400 mr-3' />
                            <h2 className='text-2xl font-bold text-gray-800'>Activity Gallery</h2>
                        </div>
                        
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                            {/* Main selected image */}
                            <div className='lg:col-span-2'>
                                <div className='rounded-lg w-[95%] overflow-hidden shadow-sm shadow-gray-400'>
                                    <img 
                                        className='w-full h-96' 
                                        src={selectedImage} 
                                        alt="Selected activity" 
                                    />
                                </div>
                            </div>
                            
                            {/* Thumbnail gallery */}
                            <div className='space-y-4'>
                                <h3 className='font-medium text-gray-700'>Click on an image to view it larger</h3>
                                <div className='grid grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2'>
                                    {activity.activity_images.map((img, index) => (
                                        <div 
                                            key={index} 
                                            className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200 ${
                                                selectedImage === img ? 'border-orange-400 scale-105' : 'border-gray-200 hover:border-orange-300'
                                            }`}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <img 
                                                className='w-full h-24 ' 
                                                src={img} 
                                                alt={`Activity ${index + 1}`} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityDetails