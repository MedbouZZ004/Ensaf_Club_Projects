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
                  >
                    <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 mr-2 transition-opacity duration-300"></span>
                    {club.name}
                  </Link>
                </li>
              ))}
              
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