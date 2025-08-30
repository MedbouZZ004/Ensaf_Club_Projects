import React from 'react'
import { useActionState } from 'react'
import { useSearchParams } from 'react-router-dom'
const AddAndEditClubPage = () => {
  const categoriesNumbers = [1, 2, 3, 4, 5, 6]
  const [numberOfCategories, setNumberOfCategories] = React.useState(0)
  const [state, formAction, isPending] = useActionState(handleSubmit, {success:null, message:null});
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("id");
  function handleSubmit(prevState, formData){
    const clubName = formData.get("clubName");
    const clubDescription = formData.get("clubDescription");
    const categories = Array.from({ length: numberOfCategories }, (_, index) =>
      formData.get(`category-${index}`)
    );

    const linkedIn = formData.get("linkedin");
    const instagram = formData.get("instagram");

    const clubImage = formData.get("clubImage");
    const clubVideo = formData.get("clubVideo");
    const adminName = formData.get("adminName");
    const adminEmail = formData.get("adminEmail");
    const adminPassword = formData.get("adminPassword");
    const data = {
      clubName,
      clubDescription,
      categories,
      linkedIn,
      instagram,
      clubImage,
      clubVideo,
      adminName,
      adminEmail,
      adminPassword
    }
    console.log(data)
  }
  return (
    <main className="p-4  h-screen overflow-y-auto md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold font-roboto text-orange-400">
          {clubId ? 'Edit Club' : 'Add New Club'}
        </h1>
      </div>

      <form 
      action={formAction}
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
                  placeholder="Enter Instagram link..."
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
                  placeholder="Enter LinkedIn link..."
                  className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
                />
              </div>
            </div>

            {/* Media Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clubImage" className="block text-sm font-medium text-gray-700 mb-1">
                  {clubId ? 'Edit Club Image' : 'Club Image'}
                </label>
                <input
                  id="clubImage"
                  type="file"
                  accept="image/*"
                  required
                  name="clubImage"
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>
              <div>
                <label htmlFor="clubVideo" className="block text-sm font-medium text-gray-700 mb-1">
                  {clubId ? 'Edit Club Video' : 'Club Video'}
                </label>
                <input
                  id="clubVideo"
                  type="file"
                  accept="video/*"
                  required
                  name="clubVideo"
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>
            </div>
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
                {clubId ? 'Edit Admin Password' : 'Admin Passwor'}              
              </label>
              <input
                id="adminPassword"
                type="password"
                placeholder="Enter admin password..."
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
            {isPending ?  `${clubId ? 'Club Is Editing...': 'Club Is Adding...'}` : `${clubId ? 'Edit Club': 'Add Club'}`}
          </button>
        </div>
      </form>
    </main>
  )
}

export default AddAndEditClubPage;
