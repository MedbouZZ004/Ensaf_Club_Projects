import React, { useEffect, useState } from 'react';
import { FaChevronUp, FaChevronDown, FaEye, FaEyeSlash } from "react-icons/fa";
import ActivityCard from './ActivityCard';
const ClubActivities = ({ activities = [] }) => {
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(0);
  const [openActivityCard, setOpenActivityCard] = useState(false);

  const len = Array.isArray(activities) ? activities.length : 0;

  // Reset index when data changes to avoid out-of-bounds
  useEffect(() => {
    if (len === 0) return;
    if (selectedActivityIndex >= len) setSelectedActivityIndex(0);
  }, [len, selectedActivityIndex]);

  if (len === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center px-10">
        <p className="text-neutral-400">No activities available.</p>
      </section>
    );
  }

  const selectedActivity = activities[selectedActivityIndex];
  
  const scrollUp = () => {
  setSelectedActivityIndex(prev => prev === 0 ? len - 1 : prev - 1);
  };

  const scrollDown = () => {
  setSelectedActivityIndex(prev => prev === len - 1 ? 0 : prev + 1);
  };

  
  return (
    <section className="min-h-screen flex relative items-center px-10 ">
      <div aria-hidden className="pointer-events-none absolute -top-16 -left-10 w-[50vw] max-w-[240px] h-[50vw] max-h-[240px] rounded-full bg-orange-200/20 blur-[140px]" />
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-roboto mb-4">
            CLUB ACTIVITIES
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          {/* Activities List */}
          <div className="w-full lg:w-2/5 flex flex-col justify-center">
            <div className="relative bg-neutral-800/30 rounded-2xl p-6 border border-neutral-700/50 shadow-xl">
              {/* Scroll up button */}
              <button 
                onClick={scrollUp}
                className="absolute -top-11 left-1/2 cursor-pointer -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-b from-primary to-primary/80  flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 z-10"
              >
                <FaChevronUp />
              </button>
              
              {/* Activities container */}
              <div className="flex flex-col gap-4 py-2 max-h-96 overflow-y-auto custom-scrollbar">
                {activities.map((activity, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedActivityIndex(index)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                      selectedActivityIndex === index 
                        ? 'bg-neutral-700/50 border-primary/60 shadow-lg' 
                        : 'bg-neutral-800/20 border-neutral-600/30 hover:bg-neutral-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${selectedActivityIndex === index ? 'text-primary' : 'text-neutral-200'}`}>
                        {activity.name}
                      </h3>
                      <button 
                      onClick={
                        ()=>{
                          if(selectedActivityIndex === index){
                            setOpenActivityCard(!openActivityCard)
                          }
                        }
                      }
                      className={`flex rounded-lg cursor-pointer text-white/80  ${selectedActivityIndex === index ? 'hover:text-primary':''} w-10 justify-center h-10 items-center gap-2`}>
                        {openActivityCard && selectedActivityIndex === index ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    
                  </div>
                ))}
              </div>
              
              {/* Scroll down button */}
              <button 
                onClick={scrollDown}
                className="absolute -bottom-11 cursor-pointer left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-1 z-10"
              >
                <FaChevronDown />
              </button>
              
              {/* Progress indicator */}
              <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  {activities.map((_, i) => (
                    <div 
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === selectedActivityIndex ? 'w-6 bg-primary' : 'w-2 bg-neutral-600'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-3/5 flex items-center">
              {openActivityCard ? 
              (
                <ActivityCard
                  activity={selectedActivity}
                /> 
              )
              : 
              (
              <div className="relative  overflow-hidden rounded-2xl w-full">

                <img 
                  src={selectedActivity?.main_image} 
                  alt={selectedActivity?.name}
                  className="w-full h-140  transition-transform duration-700 hover:scale-105"
                />
              </div>
              )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(120, 53, 15, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(120, 53, 15, 0.8);
        }
      `}</style>
    </section>
  );
};

export default ClubActivities;