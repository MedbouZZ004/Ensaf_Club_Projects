import React from 'react'
import SearchForm from './SearchForm'
import ClubCard from './ClubCard'
const ExistingClubs = ({clubs}) => {
  const [query, setQuery] = React.useState("");

  const filteredClubs = React.useMemo(() => {
    if (!query?.trim()) return clubs;
    const q = query.trim().toLowerCase();
    return clubs.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.categories?.some(cat => cat.toLowerCase().includes(q))
    );
  }, [query, clubs]);
  
  return (
    <div id="search" className='min-h-screen  flex-col gap-4 text-white relative px-10 py-4 flex items-center'>
      <h1 className='w-[100%] font-roboto font-bold  text-center text-[#ffd28f] text-4xl '>SEARCH FOR CLUBS</h1>
      <p className='text-center text-neutral-400 font-roboto'>Find your perfect club match, you can search by name OR category</p>
      <SearchForm  setQuery={setQuery} />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-[1200px] mt-8'>
        {filteredClubs.map((club) => (
          <ClubCard key={club.club_id} club={club} />
        ))}
      </div>

    </div>
  )
}

export default ExistingClubs