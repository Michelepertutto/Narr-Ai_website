
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
      <div className="flex-1 flex flex-col justify-center items-center px-5 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <h1 
            className="font-bold text-white w-full mx-auto text-center"
            style={{
              fontSize: isMobileLandscape ? '40px' : '40px',
              lineHeight: isMobileLandscape ? '40px' : '40px',
              letterSpacing: '0',
              ...(window.innerWidth >= 768 && {
                fontSize: '56px',
                lineHeight: '60px',
                letterSpacing: '0'
              })
            }}
          >
            Bring your audiobooks to life.
          </h1>
          
          {/* Paragraph */}
          <div 
            className="text-gray-200 font-medium w-full mx-auto text-center mt-6"
            style={{
              fontSize: window.innerWidth >= 768 ? '17px' : '15px',
              lineHeight: window.innerWidth >= 768 ? '26px' : '23px'
            }}
          >
            <p className="text-balance">Have an audiobook scene you're dying to see? Send us a request! We'll add it to our queue, and it's typically ready in 1-3 days.</p>
          </div>
          
          {/* Email and Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-2xl mx-auto">
            <div className="flex w-full sm:flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 sm:px-6 py-2 sm:py-4 bg-black/40 backdrop-blur-sm border border-white/30 text-white placeholder-gray-400 font-medium rounded-l-xl transition-all duration-300 shadow-lg focus:ring-2 focus:ring-[#17d5ff] focus:outline-none"
                style={{
                  fontSize: '16px',
                  lineHeight: window.innerWidth >= 768 ? '17px' : '18px'
                }}
                aria-label="Email address"
                required
              />
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!isValidEmail(email)}
                className="px-4 sm:px-10 py-2 sm:py-4 bg-[#17d5ff] hover:bg-[#15bde6] text-black font-bold rounded-r-xl transition-all duration-300 shadow-lg hover:shadow-[#17d5ff]/50 transform hover:scale-105 flex-shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  fontSize: '16px',
                  lineHeight: window.innerWidth >= 768 ? '17px' : '18px'
                }}
                aria-haspopup="dialog"
                aria-expanded={isModalOpen}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>

      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email={email} />
    </>
  );
};

export default Hero;