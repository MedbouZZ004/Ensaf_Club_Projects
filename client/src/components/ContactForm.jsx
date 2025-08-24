
const ContactForm = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-neutral-900 to-neutral-900/80 rounded-2xl shadow-xl border border-primary/50">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-orange-400 font-roboto mb-4">Get In Touch</h1>
        <p className="text-neutral-300 max-w-md mx-auto">
          Have questions or want to learn more about our club? We'd love to hear from you.
        </p>
      </div>

      <form className="space-y-6">
        <div className="relative">
          <label htmlFor="title" className="block text-primary font-medium mb-2">
            Subject
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="What is this regarding?"
              className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="message" className="block text-primary font-medium mb-2">
            Your Message
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Tell us how we can help you..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300 resize-none"
              required
            ></textarea>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center text-sm text-neutral-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your information is secure and private
          </div>
          <button
            type="submit"
            className="bg-orange-400  hover:bg-orange-300/90 text-white cursor-pointer  hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-primary/20"
          >
            Send Message
          </button>
        </div>
      </form>

    </div>
  );
};

export default ContactForm;