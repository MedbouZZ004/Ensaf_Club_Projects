import React from 'react'
import { useParams } from 'react-router-dom'

const AddAndEditActivity = () => {
  const { id } = useParams();
  const numberOfImages = [1, 2, 3, 4, 5, 6];
  const [numberOfImagesSelected, setNumberOfImagesSelected] = React.useState(0);
  
  return (
    <section className='px-6 h-screen overflow-y-auto py-8 max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-orange-400 mb-2'>{id ? 'Edit Activity' : 'Add New Activity'}</h1>
      </div>
      
      <form className='bg-white border border-amber-400 rounded-xl shadow-md p-6 md:p-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          <div className='space-y-6'>
            <div className='pb-4 border-b border-orange-200'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-2 flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Activity Details
              </h2>
              <p className='text-gray-600 text-sm'>Enter the basic information about your activity</p>
            </div>
            
            <div className='space-y-4'>
              <div>
                <label htmlFor="activity-name" className='block text-sm font-medium text-gray-700 mb-1'>
                  Activity Name <span className='text-orange-400'>*</span>
                </label>
                <input 
                  id='activity-name' 
                  required 
                  placeholder='Enter activity name' 
                  className='w-full outline-none px-4 py-2 border border-orange-400 rounded-lg   focus:border-orange-400 focus:border-2 transition-colors duration-200'
                />
              </div>
              
              <div>
                <label htmlFor='activity-pitch' className='block text-sm font-medium text-gray-700 mb-1'>
                  Activity Pitch <span className='text-orange-400'>*</span>
                </label>
                <textarea 
                  id='activity-pitch' 
                  required 
                  placeholder='Enter a brief pitch for the activity' 
                  rows={8}
                  className='w-full outline-none px-4 py-2 border border-orange-400 rounded-lg   focus:border-orange-400 focus:border-2 transition-colors duration-200'
                />
              </div>
              
              <div>
                <label htmlFor='activity-date' className='block text-sm font-medium text-gray-700 mb-1'>
                  Activity Date <span className='text-orange-400'>*</span>
                </label>
                <input 
                  id='activity-date' 
                  type='date' 
                  required 
                  className='w-full px-4 outline-none py-2 border border-orange-400 rounded-lg   focus:border-orange-400 focus:border-2 transition-colors duration-200'
                />
              </div>
              
              <div>
                <label htmlFor='main-image' className='block text-sm font-medium text-gray-700 mb-1'>
                  Main Image <span className='text-orange-400'>*</span>
                </label>
                <div className='flex items-center justify-center w-full'>
                  <label htmlFor='main-image' className='flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors duration-200'>
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className='text-sm text-orange-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                      <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input id='main-image' type='file' accept='image/*' required className='hidden' />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Activity Images Section */}
          <div className='space-y-6'>
            <div className='pb-4 border-b border-orange-200'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-2 flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
               {id ? 'Edit' : 'Add'} the activity images
              </h2>
              <p className='text-gray-600 text-sm'>Select how many  images you want to add</p>
            </div>
            
            <div className='space-y-4'>
              <div>
                <label htmlFor='image-count' className='block text-sm font-medium text-gray-700 mb-1'>
                  Number of Images
                </label>
                <select 
                  onChange={(e) => setNumberOfImagesSelected(parseInt(e.target.value) || 0)} 
                  id='image-count'
                  className='w-full px-4 py-2 border border-orange-400 rounded-lg  focus:border-2 focus:border-orange-400 transition-colors duration-200'
                >
                  <option value="">Select number of images</option>
                  {numberOfImages.map((numberOfImage) => (
                    <option value={numberOfImage} key={numberOfImage}>
                      {numberOfImage} {numberOfImage === 1 ? 'image' : 'images'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                {Array.from({ length: numberOfImagesSelected }, (_, i) => (
                  <div key={i} className='border border-dashed border-orange-300 rounded-lg p-4 bg-orange-50'>
                    <label htmlFor={`activity-image-${i}`} className='block text-sm font-medium text-gray-700 mb-2'>
                      Image {i + 1} <span className='text-orange-400'>*</span>
                    </label>
                    <div className='flex items-center justify-center w-full'>
                      <label htmlFor={`activity-image-${i}`} className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-white hover:bg-orange-50 transition-colors duration-200'>
                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <p className='text-xs text-orange-400'>Click to upload</p>
                        </div>
                        <input id={`activity-image-${i}`} type='file' accept='image/*' required className='hidden' />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200'>
          <button 
            type='button' 
            onClick={() => window.history.back()}
            className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return
          </button>
          <button 
            type='submit' 
            className='px-6 py-2 bg-orange-400 border  rounded-lg text-white font-medium  transition-colors duration-200 flex items-center justify-center'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {id ? 'Update Activity' : 'Create Activity'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddAndEditActivity