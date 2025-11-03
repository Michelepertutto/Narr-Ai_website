
import React from 'react';
import { HeartIcon } from './icons/HeartIcon';

const Header = () => {
  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/narrai', '_blank', 'noopener,noreferrer');
  };
  
  return (
    <header className="mt-5 px-2 sm:px-5">
      <div className="flex justify-between items-center">
        <a href="/" aria-label="Narr-Ai Home" className="no-underline text-black">
          <h1 className="text-3xl font-bold tracking-tighter">Narr-Ai</h1>
        </a>
        <button
            onClick={handleDonateClick}
            className="relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group rounded-xl transform hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <span 
              className="absolute w-full h-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 animate-spin"
              style={{ animationDuration: '4s' }}
            ></span>
            <span className="relative w-full text-base px-6 py-3 transition-all ease-in duration-200 bg-white text-black rounded-[10px] flex items-center justify-center gap-2">
                <HeartIcon className="w-5 h-5" />
                <span>Make a donation</span>
            </span>
          </button>
      </div>
    </header>
  );
};

export default Header;