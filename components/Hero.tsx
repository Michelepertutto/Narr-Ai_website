
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
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <h1 
            className="hero-title text-white w-full mx-auto text-center"
            style={{
              fontSize: 'clamp(32px, 8vw, 72px)',
              lineHeight: 'clamp(36px, 8.5vw, 80px)',
              letterSpacing: '0',
              fontWeight: '600'
            }}
          >
            AI videos,<br />for Audiobooks
          </h1>
          
          {/* Subtitle */}
          <div 
            className="text-white w-full mx-auto text-center px-2"
            style={{
              fontSize: 'clamp(13px, 3.5vw, 18px)',
              lineHeight: 'clamp(18px, 4.5vw, 28px)',
              marginTop: 'clamp(12px, 2vh, 24px)'
            }}
          >
            <p>Have an audiobook you're dying to see? Send us a request!</p>
            <p>We'll add it to our queue and your video will be uploaded in 1 to 3 days.</p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mx-auto px-2" style={{ marginTop: 'clamp(20px, 4vh, 40px)' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="cta-button px-6 sm:px-8 py-2.5 sm:py-3 bg-[#17d5ff] hover:bg-[#15bde6] text-black rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#17d5ff]/50 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
              style={{
                fontSize: 'clamp(14px, 3.5vw, 17px)',
                fontWeight: '600'
              }}
            >
              <span>Start for free</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              className="cta-button text-white hover:text-[#17d5ff] transition-colors flex items-center gap-2 justify-center"
              style={{
                fontSize: 'clamp(13px, 3vw, 16px)',
                fontWeight: '600'
              }}
            >
              <span>Download App</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email={email} />
    </>
  );
};

export default Hero;