import React, { useState } from 'react';
import { HeartIcon } from './icons/HeartIcon';
import ComingNextModal from './ComingNextModal';
import FramesGallery from './FramesGallery';

const Header = () => {
  const [isComingNextOpen, setIsComingNextOpen] = useState(false);
  const [isFramesOpen, setIsFramesOpen] = useState(false);

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/narrai', '_blank', 'noopener,noreferrer');
  };
  
  return (
    <header className="relative z-50 mt-3 px-2 sm:px-5 max-h-[90px]">
      <div className="flex justify-between items-center">
        <a href="/" aria-label="Narr-Ai Home" className="no-underline text-black flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}Imgs/Narrai-Pictogram.png`} alt="Narr-Ai Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tighter">Narr-Ai</h1>
        </a>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFramesOpen(true)}
            className="relative px-4 py-2 text-sm font-semibold text-black bg-white rounded-lg transition-all duration-300 border-2 border-transparent hover:border-[#17d4ff] hover:animate-border-glow"
          >
            <span className="flex items-center gap-2">
              <span>Frames</span>
            </span>
          </button>
          <button
            onClick={() => setIsComingNextOpen(true)}
            className="relative px-4 py-2 text-sm font-semibold text-black bg-white rounded-lg transition-all duration-300 border-2 border-transparent hover:border-[#17d4ff] hover:animate-border-glow"
          >
            <span className="flex items-center gap-2">
              <span>Up Next</span>
            </span>
          </button>
          <button
            onClick={handleDonateClick}
            className="relative px-4 py-2 text-sm font-semibold text-black bg-white rounded-lg transition-all duration-300 border-2 border-transparent hover:border-[#17d4ff] hover:animate-border-glow"
          >
            <span className="flex items-center gap-2">
              <HeartIcon className="w-4 h-4" />
              <span>Make a donation</span>
            </span>
          </button>
        </div>
      </div>
      <ComingNextModal isOpen={isComingNextOpen} onClose={() => setIsComingNextOpen(false)} />
      <FramesGallery isOpen={isFramesOpen} onClose={() => setIsFramesOpen(false)} />
    </header>
  );
};

export default Header;