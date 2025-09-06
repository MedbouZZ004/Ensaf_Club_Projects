import React from 'react'
import { useActionState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useClubsStore from '../store/useClubsStore'
<<<<<<< HEAD
=======

const AddAndEditClubPage = () => {
  const {addClub, updateClub, clubs} = useClubsStore();
  const categoriesNumbers = [1, 2, 3, 4, 5, 6];
  const imageNumbers = [1, 2, 3, 4, 5, 6];
  const [numberOfCategories, setNumberOfCategories] = React.useState(0);
  const [numberOfImages, setNumberOfImages] = React.useState(0);
  const [categoriesValues, setCategoriesValues] = React.useState([]);
  const [existingMedia, setExistingMedia] = React.useState({ logo: '', video: '', images: [] });
  // Previews shown inside inputs
  const [logoPreview, setLogoPreview] = React.useState(null);
  const [videoPreview, setVideoPreview] = React.useState(null);
  const [imagesPreviews, setImagesPreviews] = React.useState([]);
  // Refs for file inputs
  const logoInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);
  const imageInputRefs = React.useRef([]);
>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
const AddAndEditClubPage = () => {
  const {addClub} = useClubsStore();
  const categoriesNumbers = [1, 2, 3, 4, 5, 6];
  const imageNumbers = [1, 2, 3, 4, 5, 6];
  const [numberOfCategories, setNumberOfCategories] = React.useState(0)
  const [numberOfImages, setNumberOfImages] = React.useState(0)
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("id");
  const isEditMode = Boolean(clubId);

<<<<<<< HEAD
=======
  // Form refs for prefill
  const formRef = React.useRef();

  // Prefill logic for edit mode
  React.useEffect(() => {
    if (!isEditMode || !clubId) return;
    let mounted = true;
    const load = async () => {
      const fromStore = Array.isArray(clubs)
        ? clubs.find(c => String(c.club_id) === String(clubId))
        : null;
      const adminFullName = fromStore?.admin?.full_name || '';
      const adminEmail = fromStore?.admin?.email || '';
      try {
        const res = await fetch(`/api/clubs/${clubId}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load club');
        if (!mounted) return;
        // Prefill fields from detailed API
        if (formRef.current) {
          formRef.current.clubName.value = data.name || fromStore?.name || '';
          formRef.current.clubDescription.value = data.description || fromStore?.description || '';
          if (formRef.current.instagram) formRef.current.instagram.value = data.instagram_link || '';
          if (formRef.current.linkedin) formRef.current.linkedin.value = data.linkedin_link || '';
          if (formRef.current.adminName) formRef.current.adminName.value = adminFullName;
          if (formRef.current.adminEmail) formRef.current.adminEmail.value = adminEmail;
        }
        // Categories from store list endpoint
        const cats = Array.isArray(fromStore?.categories) ? fromStore.categories : [];
        setNumberOfCategories(cats.length);
        setCategoriesValues(cats);
    // Media previews
  setExistingMedia({
          logo: data.logo || fromStore?.logo || '',
          video: data.short_video || '',
          images: Array.isArray(data.club_images) ? data.club_images : []
        });
  const imgsLen = Array.isArray(data.club_images) ? data.club_images.length : 0;
  setNumberOfImages(imgsLen);
  setLogoPreview(data.logo || fromStore?.logo || null);
  setVideoPreview(data.short_video || null);
  setImagesPreviews(Array.isArray(data.club_images) ? data.club_images : []);
  } catch {
        // Fallback to store-only data
        if (formRef.current && fromStore) {
          formRef.current.clubName.value = fromStore.name || '';
          formRef.current.clubDescription.value = fromStore.description || '';
          if (formRef.current.instagram) formRef.current.instagram.value = fromStore.instagram_link || '';
          if (formRef.current.linkedin) formRef.current.linkedin.value = fromStore.linkedin_link || '';
          if (formRef.current.adminName) formRef.current.adminName.value = adminFullName;
          if (formRef.current.adminEmail) formRef.current.adminEmail.value = adminEmail;
        }
        const cats = Array.isArray(fromStore?.categories) ? fromStore.categories : [];
        setNumberOfCategories(cats.length);
        setCategoriesValues(cats);
  setExistingMedia({ logo: fromStore?.logo || '', video: '', images: [] });
  setNumberOfImages(0);
  setLogoPreview(fromStore?.logo || null);
  setVideoPreview(null);
  setImagesPreviews([]);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isEditMode, clubId, clubs]);

  // Handlers for previews
  const handleLogoChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      if (logoPreview && typeof logoPreview === 'string' && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoPreview(URL.createObjectURL(f));
    }
  };
  const handleVideoChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      if (videoPreview && typeof videoPreview === 'string' && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
      setVideoPreview(URL.createObjectURL(f));
    }
  };
  const handleClubImageChange = (index) => (e) => {
    const f = e.target.files?.[0];
    setImagesPreviews((prev) => {
      const next = Array.from({ length: Math.max(prev.length, numberOfImages) }, (_, i) => prev[i] ?? null);
      if (next[index] && typeof next[index] === 'string' && next[index].startsWith('blob:')) {
        URL.revokeObjectURL(next[index]);
      }
      next[index] = f ? URL.createObjectURL(f) : next[index];
      return next;
    });
  };
  React.useEffect(() => () => {
    if (logoPreview && typeof logoPreview === 'string' && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }
    if (videoPreview && typeof videoPreview === 'string' && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }
    imagesPreviews.forEach((u) => {
      if (u && typeof u === 'string' && u.startsWith('blob:')) URL.revokeObjectURL(u);
    });
  }, [logoPreview, videoPreview, imagesPreviews]);

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
  // Add handler
  async function handleAddSubmit(prevState, formData){
    const clubName = formData.get("clubName");
    const clubDescription = formData.get("clubDescription");
    const categories = Array.from({ length: numberOfCategories }, (_, index) =>
      formData.get(`category-${index}`)
    );
  const clubMainImages = formData.getAll('clubMainImages')

<<<<<<< HEAD
=======
  const linkedIn = formData.get("linkedin");
  const instagram = formData.get("instagram");

  const clubLogo = formData.get("clubLogo");
  const clubVideo = formData.get("clubVideo");
  const adminName = formData.get("adminName");
  const adminEmail = formData.get("adminEmail");
  const adminPassword = formData.get("adminPassword");
  const confirmPassword = formData.get("confirmPassword");
>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
    const linkedIn = formData.get("linkedin");
    const instagram = formData.get("instagram");

  const clubLogo = formData.get("clubLogo");
  const clubVideo = formData.get("clubVideo");
    const adminName = formData.get("adminName");
    const adminEmail = formData.get("adminEmail");
    const adminPassword = formData.get("adminPassword");
    const confirmPassword = formData.get("confirmPassword");

  // Build multipart form data for upload
  const payload = new FormData();
  payload.append('clubName', clubName);
  payload.append('clubDescription', clubDescription);
  categories.forEach((c) => c && payload.append('categories', c));
  payload.append('linkedIn', linkedIn || '');
  payload.append('instagram', instagram || '');
  if (clubLogo) payload.append('clubLogo', clubLogo);
  clubMainImages.forEach((file) => file && payload.append('clubMainImages', file));
  if (clubVideo) payload.append('clubVideo', clubVideo);
  payload.append('adminName', adminName);
  payload.append('adminEmail', adminEmail);
  payload.append('adminPassword', adminPassword);
  if (confirmPassword) payload.append('confirmPassword', confirmPassword);
  console.log(payload);
  const result = await addClub(payload);
    return result;
  }

<<<<<<< HEAD
=======

  // Edit handler
  async function handleEditSubmit(prevState, formData) {
    // Build FormData for PUT
    const clubName = formData.get("clubName");
    const clubDescription = formData.get("clubDescription");
    const categories = Array.from({ length: numberOfCategories }, (_, index) =>
      formData.get(`category-${index}`)
    );
  // We'll read files per slot below; no need to prefetch here
    const linkedIn = formData.get("linkedin");
    const instagram = formData.get("instagram");
    const clubLogo = formData.get("clubLogo");
    const clubVideo = formData.get("clubVideo");
    const adminName = formData.get("adminName");
    const adminEmail = formData.get("adminEmail");
    const adminPassword = formData.get("adminPassword");
    // Build multipart form data for upload
    const payload = new FormData();
    if (clubName) payload.append('name', clubName);
    if (clubDescription) payload.append('description', clubDescription);
    categories.forEach((c) => c && payload.append('categories', c));
    if (linkedIn) payload.append('linkedin_link', linkedIn);
    if (instagram) payload.append('instagram_link', instagram);
    if (clubLogo && clubLogo.size > 0) payload.append('clubLogo', clubLogo);
    // Build replacement mapping by slot order using refs, so order stays aligned
    const rt = [];
    for (let i = 0; i < numberOfImages; i++) {
      const el = imageInputRefs.current?.[i];
      const file = el?.files?.[0];
      if (file) {
        payload.append('clubMainImages', file);
        const target = existingMedia.images?.[i] || '';
        rt.push(target);
      }
    }
    if (rt.length) payload.append('replaceTargets', JSON.stringify(rt));
    if (clubVideo && clubVideo.size > 0) payload.append('clubVideo', clubVideo);
    if (adminName) payload.append('adminName', adminName);
    if (adminEmail) payload.append('adminEmail', adminEmail);
    if (adminPassword) payload.append('adminPassword', adminPassword);
    // Call updateClub from store
    const result = await updateClub(clubId, payload);
    return result;

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
  // Edit handler (placeholder until update API is available)
  async function handleEditSubmit(){
    return {success:false, message:'Edit flow not implemented yet.'}
  }

  const [, formAddAction, isAddPending] = useActionState(handleAddSubmit, {success:null, message:null});
  const [, formEditAction, isEditPending] = useActionState(handleEditSubmit, {success:null, message:null});
  
  return (
    <main className="p-4  h-screen overflow-y-auto md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold font-roboto text-orange-400">
          {clubId ? 'Edit Club' : 'Add New Club'}
        </h1>
      </div>

  <form 
<<<<<<< HEAD
=======
    ref={formRef}
    encType="multipart/form-data"
    action={isEditMode ? formEditAction : formAddAction}
    className="grid grid-cols-1 lg:grid-cols-12 gap-6">

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
  encType="multipart/form-data"
  action={isEditMode ? formEditAction : formAddAction}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 rounded-xl border border-orange-200 bg-white shadow-sm">
          <div className="px-4 md:px-6 py-4 border-b border-orange-100">
            <h3 className="text-lg font-semibold text-black underline font-roboto">{clubId ? 'Edit Club Details' : 'Club Details'}</h3>
          </div>
          <div className="px-4 md:px-6 py-5 space-y-5">
            <div>
              <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-1">
                {clubId ? 'Edit Club Name' : 'Club Name'}
              </label>
              <input
                id="clubName"
                type="text"
<<<<<<< HEAD
=======
                placeholder={clubId ? 'Enter the new club name...' : 'Enter club name...'}

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
                placeholder="Enter club name..."
                required
                name="clubName"
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="clubDescription" className="block text-sm font-medium text-gray-700 mb-1">
                {clubId ? 'Edit Club Description' : 'Club Description'}
              </label>
              <textarea
                id="clubDescription"
                rows={5}
                name="clubDescription"
<<<<<<< HEAD
=======
                placeholder={clubId ? 'Enter the new club description...' : 'Enter club description...'}

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
                placeholder="Enter club description..."
                required
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              ></textarea>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="categoriesCount" className="block text-sm font-medium text-gray-700 mb-1">
                 {clubId ? 'Edit Categories' : 'Categories'}
                </label>
                <select
                  id="categoriesCount"
                  className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
                  defaultValue=""
                  onChange={(e) => setNumberOfCategories(Number(e.target.value || 0))}
                >
                  <option value="">Select number of categories in this club</option>
                  {categoriesNumbers.map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>

              {numberOfCategories > 0 && (
<<<<<<< HEAD
=======
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: numberOfCategories }, (_, index) => (
                    <div key={index}>
                      <label htmlFor={`category-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      {clubId ? `Edit Category ${index + 1} Name` : `Category ${index + 1} Name`}
                      </label>
                      <input
                        id={`category-${index}`}
                        type="text"
                        name={`category-${index}`}
<<<<<<< HEAD
=======
      defaultValue={categoriesValues[index] || ''}
      placeholder={clubId ? `Enter the new category ${index + 1} name...` : `Enter category ${index + 1} name...`}

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
                        placeholder="Enter category name..."
                        required
                        className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  {clubId ?'Edit Instagram Link': 'Instagram Link'}
                </label>
                <input
                  id="instagram"
                  type="url"
<<<<<<< HEAD
                  placeholder="Enter Instagram link..."
=======
                  placeholder={clubId ? 'Enter the new Instagram link...' : 'Enter Instagram link...'}

                  placeholder="Enter Instagram link..."
 
>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
                  name="instagram"
                  className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
                />
              </div>
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                  {clubId ? 'Edit LinkedIn Link' : 'LinkedIn Link'}
                </label>
                <input
                  id="linkedin"
                  type="url"
                  name="linkedin"
<<<<<<< HEAD
                  placeholder="Enter LinkedIn link..."
=======
                  placeholder={clubId ? 'Enter the new LinkedIn link...' : 'Enter LinkedIn link...'}


                  placeholder="Enter LinkedIn link..."

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
                  className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
                />
              </div>
            </div>

            {/* Media Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clubLogo" className="block text-sm font-medium text-gray-700 mb-1">
                  {clubId ? 'Edit Club Logo' : 'Club Logo'}
                </label>
<<<<<<< HEAD
=======
                <label htmlFor="clubLogo" className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="absolute inset-0 h-full w-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      <p className="text-xs text-orange-500">Click to upload</p>
                    </div>
                  )}
                  <input id="clubLogo" name="clubLogo" type="file" accept="image/*" className="sr-only" onChange={handleLogoChange} ref={logoInputRef} required={!isEditMode} />
                </label>

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
                <input
                  id="clubLogo"
                  type="file"
                  accept="image/*"
                  required={!isEditMode}
                  name="clubLogo"
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
<<<<<<< HEAD
=======
 
>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
              </div>
              <div>
                <label htmlFor="clubVideo" className="block text-sm font-medium text-gray-700 mb-1">
                  {clubId ? 'Edit Club Video' : 'Club Video'}
                </label>
<<<<<<< HEAD
=======
                <label htmlFor="clubVideo" className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors overflow-hidden">
                  {videoPreview ? (
                    <video src={videoPreview} className="absolute inset-0 h-full w-full object-cover" controls />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" /></svg>
                      <p className="text-xs text-orange-500">Click to upload</p>
                    </div>
                  )}
                  <input id="clubVideo" name="clubVideo" type="file" accept="video/*" className="sr-only" onChange={handleVideoChange} ref={videoInputRef} required={!isEditMode} />
                </label>

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
                <input
                  id="clubVideo"
                  type="file"
                  accept="video/*"
                  required={!isEditMode}
                  name="clubVideo"
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
<<<<<<< HEAD
=======

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label htmlFor="club-images" className="block text-sm font-medium text-gray-700 mb-1">
                 {clubId ? 'Edit Club Main Images' : 'Club Main Images'}
                </label>
                <select
                  id="club-images"
                  className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
                  defaultValue=""
                  onChange={(e) => setNumberOfImages(Number(e.target.value || 0))}
                >
                  <option value="">Select number of Main Images You Want To add</option>
                  {imageNumbers.map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>

              {numberOfImages > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: numberOfImages }, (_, index) => (
                    <div key={index}>
                      <label htmlFor={`image-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
<<<<<<< HEAD
=======
                        {clubId ? `Edit Image ${index + 1}` : `Image ${index + 1}`}
                      </label>
                      <label htmlFor={`image-${index}`} className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors overflow-hidden">
                        {imagesPreviews[index] ? (
                          <img src={imagesPreviews[index]} alt={`Image ${index+1} preview`} className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            <p className="text-xs text-orange-500">Click to upload</p>
                          </div>
                        )}
                        <input id={`image-${index}`} name="clubMainImages" type="file" accept="image/*" className="sr-only" onChange={handleClubImageChange(index)} ref={(el)=> (imageInputRefs.current[index] = el)} required={!isEditMode} />
                      </label>


>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
                      {clubId ? `Edit Image ${index + 1}` : `Image ${index + 1}`}
                      </label>
                      <input
                        id={`image-${index}`}
                        type="file"
                        name="clubMainImages"
                        accept="image/*"
                        required
                        className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
<<<<<<< HEAD
=======

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
          </div>
        </section>

        <section className="lg:col-span-4 rounded-xl border border-orange-200 bg-white shadow-sm h-fit">
          <div className="px-4 md:px-6 py-4 border-b border-orange-100">
            <h3 className="text-lg font-semibold tex-black underline font-roboto">
              {clubId ?'Edit Clubs Admin' : 'Clubs Admin'}
            </h3>
          </div>
          <div className="px-4 md:px-6 py-5 space-y-4">
            <div>
              <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-1">
                {clubId ? 'Edit Admin Full Name' : 'Admin Full Name'}
              </label>
              <input
                id="adminName"
                type="text"
                name="adminName"
                placeholder="Enter admin full name..."
                required
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              />
            </div>
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                {clubId ? 'Edit Admin Email' : 'Admin Email'}
              </label>
              <input
                id="adminEmail"
                type="email"
                name="adminEmail"
                placeholder="Enter admin email..."
                required
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              />
            </div>
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {clubId ? 'Edit Admin Password' : 'Admin Password'}              
              </label>
              <input
                id="adminPassword"
                type="password"
                placeholder="Enter admin password..."
<<<<<<< HEAD
=======
                required={!isEditMode}
                name="adminPassword"
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              />
              {isEditMode && (
                <p className="text-xs text-gray-500 mt-1">Leave blank to keep the current password.</p>
              )}

>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
                required
                name="adminPassword"
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              />
            </div>
            {
            !clubId && 
            <div>
              <label htmlFor="adminConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="adminConfirmPassword"
                type="password"
                placeholder="Confirm admin password..."
                required
                name="confirmPassword"
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              />
            </div>}
          </div>
        </section>

        <div className="lg:col-span-12 flex items-center justify-end gap-3">
          <button 
          onClick={()=>window.history.back()}
          type="button" className="px-4 py-2 rounded-lg border border-orange-200 text-orange-700 hover:bg-orange-50 transition">
            Return 
          </button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-orange-400 hover:bg-orange-400/90 text-white font-semibold transition">
            {(isEditMode ? isEditPending : isAddPending) ?  `${clubId ? 'Club Is Editing...': 'Club Is Adding...'}` : `${clubId ? 'Edit Club': 'Add Club'}`}
          </button>
        </div>
      </form>
    </main>
  )
}
<<<<<<< HEAD

export default AddAndEditClubPage;
=======
export default AddAndEditClubPage;
>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
