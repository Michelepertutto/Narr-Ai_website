
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
        <p className={`${isMobileLandscape ? 'text-xs mt-2' : 'mt-3 sm:mt-6 text-sm sm:text-base'} max-w-3xl mx-auto text-gray-200 font-medium [text-shadow:1px_1px_2px_rgba(0,0,0,0.7)] leading-relaxed`}>
          Experience your favorite stories like never before.<br className="hidden sm:block" />
          Explore iconic scenes from celebrated audiobooks, brought to life through powerful artificial intelligence tools. Start with our video tributes and get pulled back into the world you love.<br className="hidden sm:block" />
          <span className="block mt-2">This project is an independent artistic initiative. If you appreciate our work, you can support it with a contribution. All donations are used exclusively to cover the AI computation and generation costs necessary to create new works.</span>
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