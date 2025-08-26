import React from 'react';
import { motion } from 'framer-motion';

const Error = ({ error }) => {
  // Check if error exists and extract message
  const errorMessage = error?.message || error || "Something went wrong";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-red-400/30 rounded-2xl p-6 max-w-md w-full shadow-xl"
      >
        <div className="text-center">
          {/* Animated Error Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-red-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </motion.div>
          
          {/* Error Title */}
          <h2 className="text-2xl font-bold text-red-400 mb-2">Oops! Something went wrong</h2>
          
          {/* Error Message */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-neutral-300 mb-6"
          >
            {errorMessage}
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors duration-300 font-medium"
            >
              Go Back
            </button>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-red-400/20 animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-red-400/20 animate-pulse delay-1000"></div>
      </motion.div>
    </motion.div>
  );
};

export default Error;