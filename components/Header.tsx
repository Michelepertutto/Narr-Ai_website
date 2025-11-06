import React, { useState } from 'react';
import { HeartIcon } from './icons/HeartIcon';
import ComingNextModal from './ComingNextModal';

const Header = () => {
  const [isComingNextOpen, setIsComingNextOpen] = useState(false);

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/narrai', '_blank', 'noopener,noreferrer');
  };
  
  return (
    <header className="mt-5 px-2 sm:px-5">
      <div className="flex justify-between items-center">
        <a href="/" aria-label="Narr-Ai Home" className="no-underline text-black flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}Imgs/Narrai-Pictogram.png`} alt="Narr-Ai Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold tracking-tighter">Narr-Ai</h1>
        </a>
        <div className="flex gap-3">
          <button
            onClick={() => setIsComingNextOpen(true)}
            className="relative px-6 py-3 font-bold text-white overflow-hidden group rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 group-hover:scale-110"></span>
            <span className="relative flex items-center gap-2">
              <span>Coming Next</span>
            </span>
          </button>
          <button
            onClick={handleDonateClick}
            className="relative px-6 py-3 font-bold overflow-hidden group rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient-x"></span>
            <span className="relative flex items-center gap-2 text-white">
              <HeartIcon className="w-5 h-5 animate-pulse" />
              <span>Make a donation</span>
            </span>
          </button>
        </div>
      </div>
      <ComingNextModal isOpen={isComingNextOpen} onClose={() => setIsComingNextOpen(false)} />
    </header>
  );
};

export default Header;