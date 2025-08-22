import React, { useMemo, useState } from 'react';
import { MdAttachEmail } from "react-icons/md";

const ClubBoardMembers = ({ boardMembers }) => {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 6;
  const displayedMembers = useMemo(() => {
    if (!Array.isArray(boardMembers)) return [];
    return showAll ? boardMembers : boardMembers.slice(0, Math.min(boardMembers.length, initialCount));
  }, [boardMembers, showAll]);

  return (
    <section className="px-4 py-5 md:px-8 lg:px-10 xl:px-12 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-primary font-roboto font-bold text-3xl md:text-4xl mb-4">
            Club Board Members
          </h1>
          <p className="text-neutral-300  max-w-3xl mx-auto">
            Meet the dedicated team leading our club forward with passion and expertise
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedMembers.map(({ fullname, email, image, role }, index) => (
            <div 
              key={`${fullname}-${index}`} 
              className="group bg-neutral-800/50 rounded-xl overflow-hidden transition-all duration-300 hover:bg-neutral-800/70 hover:-translate-y-2 shadow-lg hover:shadow-xs hover:shadow-primary/10 border border-neutral-400/50"
            >
              <div className="relative overflow-hidden h-60">
                <img 
                  src={image} 
                  alt={`${fullname}, ${role}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              </div>
              
              <div className="py-4 flex justify-between px-4">
                <div className='flex flex-col '>
                  <h2 className="text-xl font-bold font-roboto text-white mb-1 transition-colors duration-300">
                    {fullname}
                  </h2>
                  <p className="text-primary font-medium  font-roboto mb-2">{role}</p>         
                </div>
                <a href={`mailto:${email}`} className="text-primary text-5xl hover:text-primary/80 transition-colors duration-300">
                  <MdAttachEmail className="inline-block mr-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {Array.isArray(boardMembers) && boardMembers.length > initialCount && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              aria-expanded={showAll}
              onClick={() => setShowAll(v => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-orange-300/50 bg-orange-300 text-neutral-700 cursor-pointer px-4 py-2 font-medium shadow hover:bg-orange-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/70"
            >
              {showAll ? 'Show less' : 'Show all members'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClubBoardMembers;