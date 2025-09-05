import React from 'react'

import { useSearchParams } from 'react-router-dom';
import { useActionState} from 'react';
import useClubsStore from '../store/useClubsStore';

const AddAndEditActivity = () => {
  const {addActivity, updateActivity, activities, clubActivities} = useClubsStore();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get("id");
  const clubId = searchParams.get("clubId");
  const numberOfImages = [1, 2, 3, 4, 5, 6];

  // Refs
  const formRef = React.useRef(null);
  const mainImageInputRef = React.useRef(null);
  const activityImageRefs = React.useRef([]);

  const [numberOfImagesSelected, setNumberOfImagesSelected] = React.useState(0);
  // Preview states for images
  const [mainImagePreview, setMainImagePreview] = React.useState(null);
  const [activityImagesPreviews, setActivityImagesPreviews] = React.useState([]);

  // If editing: load activity and prefill previews (run again when activities change)
  React.useEffect(() => {
    const init = async () => {
      if (!activityId) return;
      if (!activities || activities.length === 0) {
        try { await clubActivities(); } catch { /* ignore */ }
        return;
      }
      const actIdNum = parseInt(activityId, 10);
      const act = (activities || []).find(a => a.activity_id === actIdNum);
      if (act) {
        try { if (mainImagePreview && String(mainImagePreview).startsWith('blob:')) URL.revokeObjectURL(mainImagePreview); } catch { /* ignore */ }
        setMainImagePreview(act.main_image || null);
        const imgs = Array.isArray(act.activity_images) ? act.activity_images : [];
        setNumberOfImagesSelected(imgs.length);
        setActivityImagesPreviews(imgs);
      }
    };
    init();
  }, [activityId, activities, clubActivities, mainImagePreview]);
  
  // handle form: 
  const [_STATE, formAddAction, isPending] = useActionState(handleSubmit, {success:null, error:null})
  
  // Handlers for file changes
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try { if (mainImagePreview) URL.revokeObjectURL(mainImagePreview); } catch (e) { console.debug('ignore revoke error', e?.message); }
      setMainImagePreview(URL.createObjectURL(file));
    } else {
      try { if (mainImagePreview) URL.revokeObjectURL(mainImagePreview); } catch (e) { console.debug('ignore revoke error', e?.message); }
      setMainImagePreview(null);
    }
  };
  const handleActivityImageChange = (index) => (e) => {
    const file = e.target.files?.[0];
    setActivityImagesPreviews((prev) => {
      const next = Array.from({ length: Math.max(prev.length, numberOfImagesSelected) }, (_, i) => prev[i] ?? null);
      if (file) {
        try { if (next[index]) URL.revokeObjectURL(next[index]); } catch (e) { console.debug('ignore revoke error', e?.message); }
        next[index] = URL.createObjectURL(file);
      } else {
        try { if (next[index]) URL.revokeObjectURL(next[index]); } catch (e) { console.debug('ignore revoke error', e?.message); }
        next[index] = null;
      }
      return next;
    });
  };

  // Keep previews array length in sync with selected count
  React.useEffect(() => {
    setActivityImagesPreviews((prev) => Array.from({ length: numberOfImagesSelected }, (_, i) => prev[i] ?? null));
  }, [numberOfImagesSelected]);

  // Cleanup created object URLs on unmount or when previews change
  React.useEffect(() => {
    return () => {
      try { if (mainImagePreview) URL.revokeObjectURL(mainImagePreview); } catch (e) { console.debug('ignore revoke error', e?.message); }
      try {
        for (const url of activityImagesPreviews) {
          if (url) URL.revokeObjectURL(url);
        }
      } catch (e) { console.debug('ignore revoke error', e?.message); }
    };
  }, [mainImagePreview, activityImagesPreviews]);

  async function handleSubmit (prevState, formData){
    const activityName = formData.get('activityName');
    const activityPitch = formData.get('activityPitch');
    const activityDate = formData.get('activityDate');
    const mainImage = formData.get('mainImage');
    const payload = new FormData();
    payload.append('activityName', activityName);
    payload.append('activityPitch', activityPitch);
    payload.append('activityDate', activityDate);
  if (mainImage) payload.append('mainImage', mainImage);
  if (clubId) payload.append('clubId', clubId);
    for (let i = 0; i < numberOfImagesSelected; i++) {
      const f = formData.get(`activityImage${i}`);
      if (f) payload.append(`activityImage${i}`, f);
    }
    try{
  const res = activityId ? await updateActivity(parseInt(activityId,10), payload) : await addActivity(payload);
      // On success, clear previews and file inputs but keep the selected count
      if (res?.success) {
        // Reset form fields (text/date)
  try { formRef.current?.reset(); } catch (e) { console.debug('form reset ignore', e?.message); }
        // Clear main image preview and file input
  try { if (mainImagePreview) URL.revokeObjectURL(mainImagePreview); } catch (e) { console.debug('revoke ignore', e?.message); }
        setMainImagePreview(null);
  try { if (mainImageInputRef.current) mainImageInputRef.current.value = ''; } catch (e) { console.debug('clear file input ignore', e?.message); }
  // Clear activity images previews and inputs if adding; if editing, keep previews unless user changed gallery
  setActivityImagesPreviews((prev) => {
          // Revoke existing URLs
          try { prev.forEach((u) => { if (u) URL.revokeObjectURL(u); }); } catch (e) { console.debug('bulk revoke ignore', e?.message); }
          // Return an array of same length filled with nulls so placeholders show
          return Array.from({ length: prev.length }, () => null);
        });
        // Clear file input values
        try {
          (activityImageRefs.current || []).forEach((ref) => { if (ref) ref.value = ''; });
  } catch (e) { console.debug('clear refs ignore', e?.message); }
      }
      return {success: !!res?.success};
    }catch(e){
      return {success:false, error: e?.message};
    }
  }
  return (
    <section className='px-6 h-screen overflow-y-auto py-8 max-w-6xl mx-auto'>
      <div className='mb-8'>
  <h1 className='text-3xl font-bold text-orange-400 mb-2'>{activityId ? 'Edit Activity' : 'Add New Activity'}</h1>
      </div>
      
  <form ref={formRef} action={formAddAction} method="post" encType="multipart/form-data" className='bg-white border border-amber-400 rounded-xl shadow-md p-6 md:p-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          <div className='space-y-6'>
            <div className='pb-4 border-b border-orange-200'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-2 flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {activityId ? 'Edit Activity Details' : 'Activity Details'}
              </h2>
              <p className='text-gray-600 text-sm'>Enter the basic information about your activity</p>
            </div>
            
            <div className='space-y-4'>
              <div>
                <label htmlFor="activity-name" className='block text-sm font-medium text-gray-700 mb-1'>
                  {activityId ? 'Edit Activity Name' : 'Activity Name'} <span className='text-orange-400'>*</span>
                </label>
                <input 
                  id='activity-name'
                  name="activityName" 
                  required 
                  placeholder={activityId ? 'Enter new activity name' : 'Enter activity name'} 
                  defaultValue={(() => {
                    if (!activityId) return '';
                    const act = activities.find(a => a.activity_id === parseInt(activityId,10));
                    return act?.name || '';
                  })()}
                  className='w-full outline-none px-4 py-2 border border-orange-400 rounded-lg   focus:border-orange-400 focus:border-2 transition-colors duration-200'
                />
              </div>
              
              <div>
                <label htmlFor='activity-pitch' className='block text-sm font-medium text-gray-700 mb-1'>
                  {activityId ? 'Edit Activity Pitch' : 'Activity Pitch'} <span className='text-orange-400'>*</span>
                </label>
                <textarea 
                  id='activity-pitch' 
                  required 
                  name="activityPitch"
                  placeholder={activityId ? 'Enter a new brief pitch for the activity' : 'Enter a brief pitch for the activity'} 
                  defaultValue={(() => {
                    if (!activityId) return '';
                    const act = activities.find(a => a.activity_id === parseInt(activityId,10));
                    return act?.pitch || '';
                  })()}
                  rows={8}
                  className='w-full outline-none px-4 py-2 border border-orange-400 rounded-lg   focus:border-orange-400 focus:border-2 transition-colors duration-200'
                />
              </div>
              
              <div>
                <label htmlFor='activity-date' className='block text-sm font-medium text-gray-700 mb-1'>
                  {activityId ? 'Edit Activity Date' : 'Activity Date'} <span className='text-orange-400'>*</span>
                </label>
                <input 
                  id='activity-date' 
                  type='date' 
                  name="activityDate"
                  required 
                  defaultValue={(() => {
                    if (!activityId) return '';
                    const act = activities.find(a => a.activity_id === parseInt(activityId,10));
                    if (!act?.activity_date) return '';
                    // Format to yyyy-mm-dd
                    try { return new Date(act.activity_date).toISOString().split('T')[0]; } catch { return '' }
                  })()}
                  className='w-full px-4 outline-none py-2 border border-orange-400 rounded-lg   focus:border-orange-400 focus:border-2 transition-colors duration-200'
                />
              </div>
              
              <div>
                <label htmlFor='main-image' className='block text-sm font-medium text-gray-700 mb-1'>
                 {activityId ? 'Edit' : 'Add'} Main Image {(!activityId) && (<span className='text-orange-400'>*</span>)}
                </label>
                <div className='flex items-center justify-center w-full'>
                  <label htmlFor='main-image' className='relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors duration-200 overflow-hidden'>
                    {mainImagePreview ? (
                      <img src={mainImagePreview} alt='Main preview' className='absolute inset-0 h-full w-full object-cover' />
                    ) : (
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className='text-sm text-orange-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                        <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      name="mainImage"
                      id='main-image'
                      type='file' accept='image/*' className='sr-only' onChange={handleMainImageChange} ref={mainImageInputRef} required={!activityId} />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className='space-y-6'>
            <div className='pb-4 border-b border-orange-200'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-2 flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
               {activityId ? 'Edit' : 'Add'} the activity images
              </h2>
              <p className='text-gray-600 text-sm'>Select how many  images you want to add</p>
            </div>
            
            <div className='space-y-4'>
              <div>
                <label htmlFor='image-count' className='block text-sm font-medium text-gray-700 mb-1'>
                  Number of Images
                </label>
                <select 
                  value={numberOfImagesSelected || ''}
                  onChange={(e) => setNumberOfImagesSelected(parseInt(e.target.value) || 0)} 
                  id='image-count'
                  className='w-full outline-none px-4 py-2 border border-orange-400 rounded-lg  focus:border-2 focus:border-orange-400 transition-colors duration-200'
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
                    {activityId ? 'Edit' : 'Add'} Image {i + 1} <span className='text-orange-400'>*</span>
                    </label>
        <div className='flex items-center justify-center w-full'>
                      <label htmlFor={`activity-image-${i}`} className='relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-white hover:bg-orange-50 transition-colors duration-200 overflow-hidden'>
                        {activityImagesPreviews[i] ? (
                          <img src={activityImagesPreviews[i]} alt={`Activity ${i+1} preview`} className='absolute inset-0 h-full w-full object-cover' />
                        ) : (
                          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <p className='text-xs text-orange-400'>Click to upload</p>
                          </div>
                        )}
                        <input 
                          name={`activityImage${i}`}
          id={`activity-image-${i}`} type='file' accept='image/*' className='sr-only' onChange={handleActivityImageChange(i)} ref={(el) => (activityImageRefs.current[i] = el)} />
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
            className='px-6 py-2 bg-orange-400 border hover:bg-orange-400/80  rounded-lg text-white font-medium  transition-colors duration-200 flex items-center justify-center'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
              {activityId ? (isPending ? 'Updating...' : 'Update Activity') : (isPending ? 'Creating...':'Create Activity')}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddAndEditActivity