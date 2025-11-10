import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    <>
    <header className="relative z-[10000] w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}Imgs/Narrai-Pictogram.png`} alt="Narr-Ai Logo" className="w-8 h-8" />
          <h1 className="logo text-2xl tracking-tighter text-black">Narr-Ai</h1>
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
        <div className="hidden md:flex gap-4">
          <button
            onClick={onFramesClick}
            className="relative px-4 py-2 text-sm font-semibold text-black hover:text-[#17d4ff] transition-colors"
          >
            Frames
          </button>
          <button
            onClick={onComingNextClick}
            className="relative px-4 py-2 text-sm font-semibold text-black hover:text-[#17d4ff] transition-colors"
          >
            Up Next
          </button>
        </div>
      </div>

    </header>
    {/* Mobile menu - rendered at root level using Portal */}
    {isMobileMenuOpen && createPortal(
      <>
        {/* Backdrop */}
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[9998]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Menu */}
        <div className="md:hidden fixed top-[60px] left-2 right-2 bg-white rounded-lg shadow-lg border-2 border-[#17d4ff] overflow-hidden z-[9999]">
          <div className="flex flex-col">
            <button
              onClick={() => { onFramesClick(); setIsMobileMenuOpen(false); }}
              className="px-4 py-3 text-left text-black hover:bg-gray-100 border-b border-gray-200"
            >
              Frames
            </button>
            <button
              onClick={() => { onComingNextClick(); setIsMobileMenuOpen(false); }}
              className="px-4 py-3 text-left text-black hover:bg-gray-100"
            >
              Up Next
            </button>
          </div>
        </div>
      </>,
      document.body
    )}
    </>
  );
};

export default Header;