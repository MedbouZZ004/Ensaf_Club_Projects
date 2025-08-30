import React from 'react';
import { FaTimes, FaEnvelope, FaUser, FaUsers, FaHashtag } from 'react-icons/fa';

const ClubDetailsCard = ({ setOpenClubDetails, selectedClub }) => {
  if (!selectedClub) return null;

  const nameInitial = (selectedClub?.name || 'C').trim().charAt(0).toUpperCase();
  const categories = selectedClub?.categories || [];
  const adminData = {
    fullname: "Yassine Ben Kacem",
    email: "yassine@gmail.com",
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-orange-200">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <h2 className="text-xl font-bold text-orange-800">Club Details</h2>
          <button
            onClick={() => setOpenClubDetails(false)}
            className="w-8 h-8 rounded-full bg-orange-200 hover:bg-orange-300 text-orange-800 flex items-center justify-center transition-colors duration-200"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Club Header */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-orange-200 bg-white overflow-hidden flex items-center justify-center shadow-md">
                {selectedClub?.logo ? (
                  <img 
                    src={selectedClub.logo} 
                    alt="Club logo" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-2xl font-bold text-orange-500">{nameInitial}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                <FaUsers size={10} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{selectedClub?.name}</h1>
              {categories?.length > 0 && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FaHashtag size={12} />
                  {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {selectedClub?.description && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                About
              </h3>
              <p className="text-gray-700 leading-relaxed bg-orange-50 p-4 rounded-lg border border-orange-100">
                {selectedClub.description}
              </p>
            </div>
          )}

          {/* Categories */}
          {categories?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <span
                    key={`${category}-${index}`}
                    className="px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium border border-orange-200 flex items-center gap-1"
                  >
                    <FaHashtag size={10} /> {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Admin data */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              Admin Information
            </h3>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700">
                  <FaUser size={16} />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">{adminData.fullname}</p>
                  <p className="text-gray-600 text-sm">Club Administrator</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-gray-700">
                <FaEnvelope className="text-orange-500" />
                <span>{adminData.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailsCard;