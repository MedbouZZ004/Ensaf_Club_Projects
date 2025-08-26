import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useClubsStore from '../store/useClubsStore';

const Footer = () => {
  const { clubs } = useClubsStore();
  
  return (
    <footer className="bg-neutral-900 font-roboto mt-5 md:mt-10 pt-20 pb-10 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent"></div>
      <div className="absolute -top-15 -right-10 w-30 h-30 rounded-full bg-primary/10 blur-xl"></div>
    <footer className="bg-[#ffe8c7] font-roboto pt-20 pb-10 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-xl"></div>
 
      <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img src ='/logo.png' className='w-50' />
             
            </div>
            <p className="text-neutral-300 mb-6 max-w-xs leading-relaxed">
              Connecting students through diverse activities and opportunities for growth, learning, and community building.
            </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h1 className='text-7xl font-bold text-neutral-800/90 bg-gradient-to-r from-neutral-800 to-primary bg-clip-text text-transparent'>
                EFC
              </h1>
              <p className="text-sm text-neutral-600 mt-1">ENSAF Football Community</p>
            </div>
            <p className="text-neutral-700 mb-6 max-w-xs leading-relaxed">
              Connecting students through diverse activities and opportunities for growth, learning, and community building.
            </p>
            <div className="flex gap-4 mt-6">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-[#ffe8c7] hover:bg-primary transition-colors duration-300 cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-[#ffe8c7] hover:bg-primary transition-colors duration-300 cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-[#ffe8c7] hover:bg-primary transition-colors duration-300 cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </div>
            </div>
          </div>

          {/* Clubs */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-primary  relative pb-2">
              Our Clubs
            </h3>
            <ul className="space-y-3">
              {clubs?.map((club) => (
                <li key={club.id}>
                  <Link 
                    to={`/clubs/${club.club_id}`} 
                    className="text-neutral-200 hover:text-primary transition-all duration-300 flex items-center group"
            <h3 className="text-xl font-bold text-neutral-800 mb-6 relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-primary">
              Our Clubs
            </h3>
            <ul className="space-y-3">
              {clubs?.slice(0, 5).map((club) => (
                <li key={club.id}>
                  <Link 
                    to={`/clubs/${club.club_id}`} 
                    className="text-neutral-700 hover:text-primary transition-all duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 mr-2 transition-opacity duration-300"></span>
                    {club.name}
                  </Link>
                </li>
              ))}
              
              {clubs && clubs.length > 5 && (
                <li>
                  <Link 
                    to="/clubs" 
                    className="text-primary font-medium hover:underline transition-all duration-300"
                  >
                    View all clubs →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-primary relative pb-2">
              Contact Us
            </h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center text-white mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaMapMarkerAlt size={14} />
                </div>
                <span className="text-neutral-200 group-hover:text-primary transition-colors duration-300">ENSAF University, Principal Street, City</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center text-white  flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaPhone size={14} />
                </div>
                <span className="text-neutral-200 group-hover:text-primary transition-colors duration-300">+212 672-740307</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope size={14} />
                </div>
                <span className="text-neutral-200 group-hover:text-primary transition-colors duration-300">yassinebenkacem12@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-10 border-t border-primary flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-200 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} ENSAF CLUBS. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-neutral-200">


            <h3 className="text-xl font-bold text-neutral-800 mb-6 relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-primary">
              Contact Us
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[#ffe8c7] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaMapMarkerAlt size={14} />
                </div>
                <span className="text-neutral-700 group-hover:text-primary transition-colors duration-300">ENSAF University, Principal Street, City</span>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[#ffe8c7] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaPhone size={14} />
                </div>
                <span className="text-neutral-700 group-hover:text-primary transition-colors duration-300">+212 672-740307</span>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[#ffe8c7] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope size={14} />
                </div>
                <span className="text-neutral-700 group-hover:text-primary transition-colors duration-300">yassinebenkacem12@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-neutral-800 mb-6 relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-primary">
              Stay Updated
            </h3>
            <p className="text-neutral-700 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              />
              <button className="bg-primary hover:bg-neutral-800 text-white font-medium py-3 px-5 rounded-lg transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-10 border-t border-neutral-300 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-700 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} ENSAF CLUBS. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-neutral-700">

            <span className="text-sm">Made with</span>
            <FaHeart className="text-red-500" />
            <span className="text-sm">by Yassine Ben Kacem & Mohamed Boukharta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;