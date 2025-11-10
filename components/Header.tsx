import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface HeaderProps {
  onCollabClick: () => void;
  onComingNextClick: () => void;
  onFullscreenClick: () => void;
}

const Header = ({ onCollabClick, onComingNextClick, onFullscreenClick }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('App is already installed or installation is not available on this device.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <>
    <header className="relative z-[10000] w-full">
      <div className="flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex lg:hidden w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}Imgs/Narrai-Pictogram.png`} alt="Narr-Ai Logo" className="w-6 h-6" />
            <h1 className="logo text-xl tracking-tighter text-black">Narr-Ai</h1>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex flex-col gap-1.5"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-[#17d4ff] rounded"></div>
            <div className="w-6 h-0.5 bg-[#17d4ff] rounded"></div>
          </button>
        </div>
        {/* Left: Logo */}
        <div className="hidden lg:flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}Imgs/Narrai-Pictogram.png`} alt="Narr-Ai Logo" className="w-8 h-8" />
          <h1 className="logo text-2xl tracking-tighter text-black">Narr Ai</h1>
        </div>
        
        {/* Center: Navigation - hidden on mobile */}
        <div className="hidden md:flex gap-8">
          <button
            onClick={onCollabClick}
            className="menu-item text-base text-black hover:text-[#17d4ff] transition-colors"
          >
            Collab
          </button>
          <button
            onClick={onComingNextClick}
            className="menu-item text-base text-black hover:text-[#17d4ff] transition-colors"
          >
            Coming Next
          </button>
        </div>

        {/* Right: Search + Fullscreen - hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-52 px-4 py-2 bg-gray-400/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17d4ff]"
              style={{ fontSize: '14px' }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={onFullscreenClick}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Fullscreen"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
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
        <div className="md:hidden fixed top-[70px] left-4 right-4 bg-black rounded-3xl shadow-2xl overflow-hidden z-[9999]" style={{ padding: '30px' }}>
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col gap-6 mb-8">
            <button
              onClick={() => { onComingNextClick(); setIsMobileMenuOpen(false); }}
              className="menu-item flex justify-between items-center text-left text-white hover:text-[#17d4ff] transition-colors py-2"
            >
              <span className="text-xl">Coming Next</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => { onCollabClick(); setIsMobileMenuOpen(false); }}
              className="menu-item flex justify-between items-center text-left text-white hover:text-[#17d4ff] transition-colors py-2"
            >
              <span className="text-xl">Collab</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); }}
              className="menu-item flex justify-between items-center text-left text-white hover:text-[#17d4ff] transition-colors py-2"
            >
              <span className="text-xl">Donations</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Bottom CTAs */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button className="cta-button px-6 py-3 bg-[#17d5ff] hover:bg-[#15bde6] text-black rounded-lg transition-all flex items-center gap-2">
              <span className="font-semibold">Start for free</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button 
              onClick={handleInstallClick}
              className="cta-button text-white hover:text-[#17d5ff] transition-colors flex items-center gap-2"
            >
              <span>{isInstallable ? 'Install App' : 'Download App'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
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