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
  const playerRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    setIsLoading(true);
  }, [videos.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    setIsLoading(true);
  }, [videos.length]);

  // Handle Fullscreen and Orientation
  useEffect(() => {
    const element = playerRef.current;
    if (element) {
      const enterFullscreen = async () => {
        try {
          await element.requestFullscreen();
          // This is a best-effort attempt and may not work on all browsers/devices (e.g., iOS Safari)
          // FIX: Cast screen.orientation to any to access experimental 'lock' property
          if (screen.orientation && (screen.orientation as any).lock) {
            await (screen.orientation as any).lock('landscape');
          }
        } catch (error) {
          console.error('Could not enter fullscreen or lock orientation:', error);
        }
      };
      enterFullscreen();
    }

    const handleFullscreenChange = () => {
      // If user exits fullscreen mode (e.g., via ESC key), we should close the player component.
      if (!document.fullscreenElement) {
        onClose();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      // Ensure we exit fullscreen and unlock orientation when the component unmounts
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      // FIX: Cast screen.orientation to any to access experimental 'unlock' property
      if (screen.orientation && (screen.orientation as any).unlock) {
        (screen.orientation as any).unlock();
      }
    };
  }, [onClose]);

  // Handle keyboard events for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
      // The 'fullscreenchange' event handles closing on 'Escape'
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrev]);

  const handleClose = () => {
    // Trigger the 'fullscreenchange' event by exiting fullscreen, which in turn calls onClose.
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      // Fallback if fullscreen API wasn't successful
      onClose();
    }
  };

  const currentVideo = videos[currentIndex];

  return (
    <div
      ref={playerRef}
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
          onClick={handleClose}
          className="text-white/70 hover:text-white transition-colors bg-black/30 rounded-full p-2"
          aria-label="Close player"
        >
          <CloseIcon className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-20">
        <h1 className="text-2xl font-bold text-white tracking-tighter [text-shadow:1px_1px_3px_rgba(0,0,0,0.5)]">
          Narr-Ai
        </h1>
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
            controls
            onCanPlay={() => setIsLoading(false)}
            onLoadedData={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            onEnded={goToNext}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default FullscreenPlayer;