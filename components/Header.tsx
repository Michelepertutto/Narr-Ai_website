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
    <header className="relative z-50 mt-5 px-2 sm:px-5">
      <div className="flex justify-between items-center">
        <a href="/" aria-label="Narr-Ai Home" className="no-underline text-black flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}Imgs/Narrai-Pictogram.png`} alt="Narr-Ai Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold tracking-tighter">Narr-Ai</h1>
        </a>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFramesOpen(true)}
            className="relative px-6 py-3 font-bold text-black bg-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-[#17d4ff] animate-border-glow"
          >
            <span className="flex items-center gap-2">
              <span>Frames</span>
            </span>
          </button>
          <button
            onClick={() => setIsComingNextOpen(true)}
            className="relative px-6 py-3 font-bold text-black bg-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-[#17d4ff] animate-border-glow"
          >
            <span className="flex items-center gap-2">
              <span>Coming Next</span>
            </span>
          </button>
          <button
            onClick={handleDonateClick}
            className="relative px-6 py-3 font-bold text-black bg-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-[#17d4ff] animate-border-glow"
          >
            <span className="flex items-center gap-2">
              <HeartIcon className="w-5 h-5" />
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