import React, { useState, useEffect } from 'react';
import RequestModal from './RequestModal';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface HeroProps {
  isMobileLandscape?: boolean;
  onWatchClick?: () => void;
}

const Hero = ({ isMobileLandscape = false, onWatchClick }: HeroProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
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
      <div className="absolute inset-0 flex flex-col p-4 sm:p-6 md:p-8">
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="w-full max-w-4xl hero-container">
            <h1 className="hero-title text-white w-full mx-auto text-center">
              AI Videos for Audiobooks
            </h1>
            <div className="hero-subtitle text-white w-full mx-auto text-center">
              <p>Have an audiobook you're dying to see? Send us a request!</p>
              <p>We'll add it to our queue and your video will be uploaded in 1 to 3 days.</p>
            </div>
            <div className="hero-cta-container flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mx-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="hero-cta-primary cta-button"
              >
                <span>Start for free</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleInstallClick}
                className="hero-cta-secondary cta-button"
              >
                <span>{isInstallable ? 'Install App' : 'Download App'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="hero-watch-container w-full flex justify-center sm:justify-end items-end">
          <button 
            onClick={onWatchClick}
            className="hero-watch-button"
          >
            <span>Watch</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email="" />
    </>
  );
};

export default Hero;