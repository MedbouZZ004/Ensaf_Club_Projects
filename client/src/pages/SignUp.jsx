import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SignUp = () => {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-black overflow-hidden">
      {/* Left Side - Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="flex flex-col justify-center items-center w-full md:w-1/2 p-4 md:p-10 z-10"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="w-full max-w-sm">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <motion.div 
                  className="bg-yellow-600 p-3 rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-black font-bold text-lg">ENSAF</span>
                </motion.div>
              </div>

              <motion.h2 
                className="text-2xl font-bold mb-2 text-yellow-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Get Started
              </motion.h2>
              <motion.p 
                className="text-gray-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Welcome to ENSAF Clubs – Let's create your account
              </motion.p>

              <div className="space-y-4">
                {[
                  { type: "text", placeholder: "First Name" },
                  { type: "text", placeholder: "Last Name" },
                  { type: "email", placeholder: "Email" },
                  { type: "tel", placeholder: "Phone" },
                  { type: "text", placeholder: "Club Name" },
                  { type: "password", placeholder: "Password" },
                ].map((input, i) => (
                  <motion.input
                    key={i}
                    type={input.type}
                    placeholder={input.placeholder}
                    className="w-full bg-gray-900 text-gray-200 border border-yellow-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  />
                ))}

                <motion.button
                  type="submit"
                  className="w-full bg-yellow-600 text-black font-bold p-3 rounded-md hover:bg-yellow-700 transition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign up
                </motion.button>
              </div>

              <motion.p 
                className="text-center text-gray-400 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                Already have an account?{" "}
                <a href="#" className="text-yellow-500 hover:underline">
                  Log in
                </a>
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Side - Banner */}
      <div className={`w-full md:${showForm ? "w-1/2" : "w-full"} relative overflow-hidden min-h-screen transition-all duration-500`}>
        {/* Dark gold gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-yellow-900"></div>
        
        {/* Abstract geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-600 rounded-full opacity-10 blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-yellow-500 rounded-full opacity-15 blur-lg"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-yellow-700 rounded-full opacity-10 blur-2xl"></div>
        </div>

        {/* Gold glitter effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative h-full flex items-center justify-center p-10 text-white">
          <div className="text-center space-y-6 max-w-md">
            {/* Icon/Logo area */}
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <div className="w-20 h-20 bg-black bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm border border-yellow-700 border-opacity-50">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-xl">E</span>
                </div>
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Explore<br />
              <span className="text-yellow-400">With Us</span>
            </motion.h1>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-semibold tracking-wider">ENSAF CLUBS</h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            </motion.div>
            
            <motion.p 
              className="text-yellow-200 text-lg font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Join our vibrant community and discover our amazing clubs and their activities 
            </motion.p>

            {/* Animated arrow pointing to form - Only visible when form is hidden */}
            {!showForm && (
              <motion.div
                className="flex justify-center mt-12 cursor-pointer"
                onClick={() => setShowForm(true)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 1.5 } 
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      y: [0, 10, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                    className="text-yellow-400 font-medium mb-2"
                  >
                    Join Us Now
                  </motion.div>
                  <motion.div
                    animate={{
                      y: [0, 10, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: 0.2
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-12 w-12 text-yellow-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14 5l7 7m0 0l-7 7m7-7H3" 
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400"></div>
      </div>
    </div>
  );
};

export default SignUp;