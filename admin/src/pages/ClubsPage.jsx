import React, { useEffect, useState } from 'react'
import useClubsStore from '../store/useClubsStore'
import Loader from '../components/Loader';
import Error from '../components/Error';
import {FaEdit, FaTrash, FaEye, FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import ClubDetailsCard from '../components/ClubDetailsCard';
const ClubsPage = () => {
  const {clubs, getClubs, error, loading, deleteClub} = useClubsStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedClub, setSelectedClub] = useState(null);
  const [openClubCardDetails, setOpenClubDetails] = useState(false);

  useEffect(() => {
    getClubs();
  }, [getClubs]);

  if(loading) return <Loader />;
  if(error) return <Error error={error} />;

  const filteredClubs = clubs?.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClubs = filteredClubs.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="w-full h-screen font-roboto overflow-y-auto flex flex-col gap-6 px-4 py-8">
      {openClubCardDetails && (
        <ClubDetailsCard 
        setOpenClubDetails={setOpenClubDetails}
        selectedClub={selectedClub} />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 font-roboto">
          Clubs <span className="text-orange-400 font-normal">({filteredClubs.length})</span>
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            placeholder="Search for club..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 sm:w-64 px-4 py-2 border border-orange-200 focus:border-orange-400 rounded-lg outline-none bg-white text-gray-800 transition"
            type="text"
          />
          <button
          onClick={()=> navigate('/clubs/add-edit-club')}
          title="ADD CLUB"
          className="bg-orange-400 hover:bg-orange-400/80 cursor-pointer text-white px-4 py-2 rounded-lg font-bold text-lg transition">+</button>
        </div>
      </div>

      {/* Clubs List */} 
      <div className="w-full rounded-xl border border-orange-200 bg-white shadow-sm">
        {filteredClubs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {searchTerm ? 'No clubs match your search' : 'No clubs found'}
          </div>
        ) : (
          <>
            <ul>
              {paginatedClubs.map((club, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center px-4 py-4 border-b last:border-b-0 border-orange-100 hover:bg-orange-50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      className="border-2 border-orange-200 rounded-full w-12 h-12 object-cover bg-gray-100"
                      src={club.logo}
                      alt={club.name}
                    />
                    <span className="font-medium text-gray-800 truncate max-w-[160px] sm:max-w-[240px]">{club.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                    onClick={() => {
                      setSelectedClub(club);
                      setOpenClubDetails(true);
                    }}
                    className="p-2 rounded hover:bg-orange-400 hover:text-white text-orange-500" title="View"><FaEye /></button>
                    <button 
                    onClick={()=>navigate(`/clubs/add-edit-club?id=${club.club_id}`)}
                    className="p-2 rounded hover:bg-blue-400 hover:text-white text-blue-500" title="Edit"><FaEdit /></button>
                    <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this club?")) {
                        deleteClub(club.club_id);
                      }
                    }}
                    className="p-2 rounded hover:bg-red-500 hover:text-white text-red-500" title="Delete"><FaTrash /></button>
                  </div>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-orange-100 bg-orange-50 gap-2">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClubs.length)} of {filteredClubs.length} clubs
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-orange-200'}`}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded text-sm ${currentPage === page ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-orange-200'}`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-orange-200'}`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ClubsPage;
