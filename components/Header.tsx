
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="mt-5 px-2 sm:px-5">
      <div className="flex justify-between items-center">
        <a href="/" aria-label="Narr-Ai Home" className="no-underline text-black">
          <h1 className="text-3xl font-bold tracking-tighter">Narr-Ai</h1>
        </a>
        <p className="text-sm font-medium text-gray-700">
          Made by Easytask Design
        </p>
      </div>
    </header>
  );
};

export default Header;