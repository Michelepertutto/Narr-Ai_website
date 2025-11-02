
import React, { useState } from 'react';
import RequestModal from './RequestModal';
import { LockIcon } from './icons/LockIcon';
import { HeartIcon } from './icons/HeartIcon';

const Hero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  const isEmailValid = (email: string) => {
    // A simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/narrai', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        <h1 className="text-3xl sm:text-5xl lg-text-6xl font-bold leading-tight text-white tracking-tighter [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)]">
          Coherent Videos for Audiobooks.
        </h1>
        <p className="mt-3 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg text-gray-200 font-medium [text-shadow:1px_1px_2px_rgba(0,0,0,0.7)]">
          Sell more audiobooks by showing videos that match the story.
        </p>
      </div>
      
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10">
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to start"
            className="w-full sm:flex-1 text-base px-5 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 font-medium rounded-xl transition-all duration-300 shadow-lg focus:ring-2 focus:ring-[#17d5ff] focus:outline-none"
            aria-label="Email address"
            required
          />
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!isEmailValid(email)}
            className="w-full sm:w-auto text-base px-8 py-3 bg-[#17d5ff] hover:bg-[#15bde6] text-black font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#17d5ff]/50 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none flex-shrink-0"
            aria-haspopup="dialog"
            aria-expanded={isModalOpen}
          >
            Request Videos
          </button>
          <button
            onClick={handleDonateClick}
            className="w-full sm:w-auto text-base px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0"
          >
            <LockIcon className="w-5 h-5" />
            <HeartIcon className="w-5 h-5" />
            <span>Donate</span>
          </button>
        </div>
      </div>

      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Hero;