import React from 'react'
import { IoMdClose } from "react-icons/io";

const ReviewForm = ({ setOpenReviewForm }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setOpenReviewForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-neutral-900 border border-primary/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <button 
          onClick={() => setOpenReviewForm(false)}
          className="absolute -top-3 -right-3 bg-primary hover:bg-primary/90 text-white w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all duration-300 hover:rotate-90"
        >
          <IoMdClose />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary font-roboto mb-2">Share Your Rewiew</h2>
          <p className="text-neutral-400">Your feedback helps us improve</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

          {/* Review Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-300 font-medium">Your Review</label>
            <textarea
              className="border border-neutral-700/50 rounded-xl p-4 bg-neutral-800/40 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none"
              rows="5"
              placeholder="Share your review about the club..."
              required
            ></textarea>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
          >
            Submit Review
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>

      </div>
    </div>
  )
}

export default ReviewForm