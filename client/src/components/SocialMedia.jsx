import React, { useState } from 'react';
import { motion } from 'framer-motion';
const MotionAside = motion.aside;
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

const SocialMedia = ({ instagram, linkedin, facebook, className = '' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const links = [
    { href: instagram, Icon: FaInstagram, label: 'Instagram', color: 'bg-gradient-to-tr from-purple-600 to-pink-500' },
    { href: linkedin, Icon: FaLinkedin, label: 'LinkedIn', color: 'bg-gradient-to-tr from-blue-600 to-blue-400' },
    { href: facebook, Icon: FaFacebook, label: 'Facebook', color: 'bg-gradient-to-tr bg-blue-400' },
  ].filter(l => !!l.href);

  if (links.length === 0) return null;

  return (
    <MotionAside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 ${className}`}
      aria-label="Social media links"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <div className="relative flex flex-col items-center gap-5">
        {/* Enhanced vertical connector with pulsing effect */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2  top-6 bottom-6 w-[2px] bg  bg-primary "
          animate={{ opacity: isHovering ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
        />
        
        {links.map(({ href, Icon: IconCmp, label, color }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group relative bg-neutral-950 grid place-items-center h-12 w-12 rounded-full border-2 border-primary/50 text-orange-200 transition-all duration-300 hover:border-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60 shadow-lg hover:shadow-xl hover:shadow-primary/20"
            >
              <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300 ${color}`} />
              <IconCmp className="text-2xl drop-shadow [filter:_saturate(120%)] transition-transform duration-200 group-hover:scale-110 relative z-10" />
              
              {/* Enhanced tooltip */}
              <span className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap rounded-md bg-neutral-900/95 text-amber-100 text-xs px-3 py-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-lg border border-orange-300/20 backdrop-blur-sm">
                {label}
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-neutral-900/95 rotate-45" />
              </span>
            </a>
          </motion.div>
        ))}
        
      </div>
    </MotionAside>
  );
};

export default SocialMedia;