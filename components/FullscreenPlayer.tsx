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

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-[100]"
      role="dialog"
      aria-modal="true"
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 md:space-x-4">
        <button
          onClick={goToPrev}
          className="text-white/70 hover:text-white transition-colors bg-black/30 rounded-full p-2"
          aria-label="Previous video"
        >
          <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={goToNext}
          className="text-white/70 hover:text-white transition-colors bg-black/30 rounded-full p-2"
          aria-label="Next video"
        >
          <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors bg-black/30 rounded-full p-2"
          aria-label="Close player"
        >
          <CloseIcon className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-20">
        <div className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}Imgs/Narrai-Pictogram.png`} alt="Narr-Ai Logo" className="w-8 h-8" />
          <h1 className="logo text-2xl tracking-tighter text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.5)]">
            Narr-Ai
          </h1>
        </div>
      </div>

      {/* Video Player with Book Cover */}
      <div className="w-full h-full flex items-center justify-center gap-4 px-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Book Cover - positioned to the left */}
        {currentVideo.bookCoverUrl && (
          <div className="flex-shrink-0 h-[80vh] max-h-[600px]">
            <img 
              src={currentVideo.bookCoverUrl} 
              alt={`${currentVideo.title} cover`}
              className="h-full w-auto object-contain rounded-lg shadow-2xl"
            />
          </div>
        )}
        
        {/* Video */}
        <div className="flex-1 h-full flex items-center justify-center">
          <video
            key={currentVideo.id}
            src={currentVideo.videoUrl}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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
            style={{
              transform: 'translateZ(0)'
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default FullscreenPlayer;