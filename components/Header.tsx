import React, { useState, useEffect } from 'react';
import { HeartIcon } from './icons/HeartIcon';

interface HeaderProps {
  onFramesClick: () => void;
  onComingNextClick: () => void;
}

const Header = ({ onFramesClick, onComingNextClick }: HeaderProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/narrai', '_blank', 'noopener,noreferrer');
  };
  
  return (
    <header className="relative z-50 mt-3 px-2 sm:px-5 max-h-[90px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}Imgs/Narrai-Pictogram.png`} alt="Narr-Ai Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tighter text-black">Narr-Ai</h1>
        </div>
        
        {/* Hamburger button - visible only on mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-black bg-white rounded-lg border-2 border-transparent hover:border-[#17d4ff]"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop menu - hidden on mobile */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={onFramesClick}
            className="relative px-4 py-2 text-sm font-semibold text-black bg-white rounded-lg transition-all duration-300 border-2 border-transparent hover:border-[#17d4ff] hover:animate-border-glow"
          >
            <span className="flex items-center gap-2">
              <span>Frames</span>
            </span>
          </button>
          <button
            onClick={onComingNextClick}
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
          {showInstall && (
            <button
              onClick={handleInstallClick}
              className="relative px-3 py-2 text-sm font-semibold text-black bg-white rounded-lg transition-all duration-300 border-2 border-transparent hover:border-[#17d4ff] hover:animate-border-glow"
              title="Install App"
            >
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu - visible only when open */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-2 bg-white rounded-lg shadow-lg border-2 border-[#17d4ff] overflow-hidden z-[100]">
          <div className="flex flex-col">
            <button
              onClick={() => { onFramesClick(); setIsMobileMenuOpen(false); }}
              className="px-4 py-3 text-left text-black hover:bg-gray-100 border-b border-gray-200"
            >
              Frames
            </button>
            <button
              onClick={() => { onComingNextClick(); setIsMobileMenuOpen(false); }}
              className="px-4 py-3 text-left text-black hover:bg-gray-100 border-b border-gray-200"
            >
              Up Next
            </button>
            <button
              onClick={() => { handleDonateClick(); setIsMobileMenuOpen(false); }}
              className="px-4 py-3 text-left text-black hover:bg-gray-100 flex items-center gap-2"
            >
              <HeartIcon className="w-4 h-4" />
              Make a donation
            </button>
            {showInstall && (
              <button
                onClick={() => { handleInstallClick(); setIsMobileMenuOpen(false); }}
                className="px-4 py-3 text-left text-black hover:bg-gray-100 border-t border-gray-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Install App
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;