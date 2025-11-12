import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Video } from '../App';
import { CloseIcon } from './icons/CloseIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface FullscreenPlayerProps {
  videos: Video[];
  startIndex: number;
  onClose: () => void;
}

const FullscreenPlayer = ({ videos, startIndex, onClose }: FullscreenPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    setIsLoading(true);
  }, [videos.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    setIsLoading(true);
  }, [videos.length]);

  // Handle keyboard events for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrev]);

  const currentVideo = videos[currentIndex];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentVideo.videoUrl;
    link.download = `${currentVideo.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 bg-black flex z-[100000]"
      role="dialog"
      aria-modal="true"
    >
      {/* Left Sidebar - collapsible on mobile */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-30 transform transition-transform duration-300' : 'relative'}
        ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        w-80 bg-gray-900 flex flex-col p-6 overflow-y-auto
      `}>
        {/* Book Cover */}
        {currentVideo.bookCoverUrl && (
          <img 
            src={currentVideo.bookCoverUrl} 
            alt={`${currentVideo.title} cover`}
            className="w-full rounded-lg shadow-2xl mb-6"
          />
        )}
        
        {/* Title & Author */}
        <h2 className="text-2xl font-bold text-white mb-2">{currentVideo.title}</h2>
        <p className="text-gray-400 text-sm mb-4">Audiobook Scene</p>
        
        {/* Scene Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Scene Description</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            An epic moment from {currentVideo.title}, brought to life with AI-generated visuals.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          <button
            onClick={handleDownload}
            className="w-full bg-[#17d4ff] hover:bg-[#15bde6] text-black font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Video
          </button>
          
          {currentVideo.audibleUrl && (
            <a
              href={currentVideo.audibleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Listen on Audible
            </a>
          )}
        </div>
      </div>

      {/* Right: Video Player */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Logo - Top Left */}
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded-lg">
            <img src={`${import.meta.env.BASE_URL}Imgs/Narrai-Pictogram.png`} alt="Narr-Ai Logo" className="w-6 h-6" />
            <h1 className="logo text-lg tracking-tighter text-white">
              Narr-Ai
            </h1>
          </div>
        </div>

        {/* Info Button - Mobile Only */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-white transition-colors bg-black/50 rounded-full p-3"
            aria-label="Toggle info"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white/70 hover:text-white transition-colors bg-black/50 rounded-full p-3"
          aria-label="Close player"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors bg-black/50 rounded-full p-3"
          aria-label="Previous video"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors bg-black/50 rounded-full p-3"
          aria-label="Next video"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#17d4ff]"></div>
          </div>
        )}
        
        {/* Video */}
        <video
          key={currentVideo.id}
          src={currentVideo.videoUrl}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          autoPlay
          playsInline
          controls
          controlsList="nodownload"
          preload="metadata"
          onCanPlay={() => setIsLoading(false)}
          onLoadedData={() => setIsLoading(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onEnded={goToNext}
        >
          Your browser does not support the video tag.
        </video>

      </div>

      {/* Backdrop for mobile sidebar */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default FullscreenPlayer;