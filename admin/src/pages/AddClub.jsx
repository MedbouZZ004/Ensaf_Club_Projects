import React from 'react'

const AddClub = () => {
  const categoriesNumbers = [1, 2, 3, 4, 5, 6]
  const [numberOfCategories, setNumberOfCategories] = React.useState(0)

  return (
    <main className="p-4  h-screen overflow-y-auto md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold font-roboto text-orange-400">
          Add New Club
        </h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 rounded-xl border border-orange-200 bg-white shadow-sm">
          <div className="px-4 md:px-6 py-4 border-b border-orange-100">
            <h3 className="text-lg font-semibold text-black underline font-roboto">Club Details</h3>
          </div>
          <div className="px-4 md:px-6 py-5 space-y-5">
            <div>
              <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-1">
                Club Name
              </label>
              <input
                id="clubName"
                type="text"
                placeholder="Enter club name..."
                required
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="clubDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Club Description
              </label>
              <textarea
                id="clubDescription"
                rows={5}
                placeholder="Enter club description..."
                required
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              ></textarea>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="categoriesCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Categories (optional)
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
                        Category {index + 1} Name
                      </label>
                      <input
                        id={`category-${index}`}
                        type="text"
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
                  Instagram Link
                </label>
                <input
                  id="instagram"
                  type="url"
                  placeholder="Enter Instagram link..."
                  className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
                />
              </div>
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Link
                </label>
                <input
                  id="linkedin"
                  type="url"
                  placeholder="Enter LinkedIn link..."
                  className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
                />
              </div>
            </div>

            {/* Media Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clubImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Club Image
                </label>
                <input
                  id="clubImage"
                  type="file"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>
              <div>
                <label htmlFor="clubVideo" className="block text-sm font-medium text-gray-700 mb-1">
                  Club Video
                </label>
                <input
                  id="clubVideo"
                  type="file"
                  accept="video/*"
                  required
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-4 rounded-xl border border-orange-200 bg-white shadow-sm h-fit">
          <div className="px-4 md:px-6 py-4 border-b border-orange-100">
            <h3 className="text-lg font-semibold tex-black underline font-roboto">Admin Details</h3>
          </div>
          <div className="px-4 md:px-6 py-5 space-y-4">
            <div>
              <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Full Name
              </label>
              <input
                id="adminName"
                type="text"
                placeholder="Enter admin full name..."
                required
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              />
            </div>
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                id="adminEmail"
                type="email"
                placeholder="Enter admin email..."
                required
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              />
            </div>
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                id="adminPassword"
                type="password"
                placeholder="Enter admin password..."
                required
                className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-800 outline-none  focus:border-orange-400 transition"
              />
            </div>
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
            </div>
          </div>
        </section>

        <div className="lg:col-span-12 flex items-center justify-end gap-3">
          <button 
          onClick={()=>window.history.back()}
          type="button" className="px-4 py-2 rounded-lg border border-orange-200 text-orange-700 hover:bg-orange-50 transition">
            Return 
          </button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-orange-400 hover:bg-orange-400/90 text-white font-semibold transition">
            Add Club
          </button>
        </div>
      </form>
    </main>
  )
}

export default AddClub
