
import React, { useState } from 'react';
import RequestModal from './RequestModal';

interface HeroProps {
  isMobileLandscape?: boolean;
}

const Hero = ({ isMobileLandscape = false }: HeroProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  const isValidEmail = (email: string): boolean => {
    // A simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <>
      <div className={`px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 ${isMobileLandscape ? 'pt-4 sm:pt-4' : ''}`}>
        <h1 className={`${isMobileLandscape ? 'text-2xl' : 'text-3xl sm:text-5xl lg-text-6xl'} font-bold leading-tight text-white tracking-tighter [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)]`}>
          Request Coherent Videos for Audiobooks.
        </h1>
        <p className={`${isMobileLandscape ? 'text-xs mt-2' : 'mt-3 sm:mt-6 text-sm sm:text-base'} w-full sm:max-w-[40%] mx-auto text-gray-200 font-medium [text-shadow:1px_1px_2px_rgba(0,0,0,0.7)] leading-relaxed text-balance`}>
          Experience your favorite stories like never before with Narr-Ai. We bring to life iconic scene from audioboooks through powerful artificial intelligence tools and human intervention. This project is an independent artistic initiative. If you appreciate our work, you can support us with a donation.
        </p>
      </div>
      
      <div className={`w-full max-w-4xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 ${isMobileLandscape ? 'pb-4 sm:pb-4' : ''}`}>
        <div className={`mt-6 sm:mt-8 flex ${isMobileLandscape ? 'flex-col scale-90' : 'flex-col sm:flex-row'} items-center justify-center gap-3`}>
          <div className="flex w-full sm:flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to start"
              className="flex-1 text-base px-5 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 font-medium rounded-l-xl transition-all duration-300 shadow-lg focus:ring-2 focus:ring-[#17d5ff] focus:outline-none"
              aria-label="Email address"
              required
            />
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!isValidEmail(email)}
              className="text-base px-8 py-3 bg-[#17d5ff] hover:bg-[#15bde6] text-black font-bold rounded-r-xl transition-all duration-300 shadow-lg hover:shadow-[#17d5ff]/50 transform hover:scale-105 flex-shrink-0 disabled:cursor-not-allowed"
              aria-haspopup="dialog"
              aria-expanded={isModalOpen}
            >
              Request Videos
            </button>
          </div>
        </div>
      </div>

      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email={email} />
    </>
  );
};

export default Hero;