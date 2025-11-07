import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface FramesGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AudiobookGallery {
  id: string;
  title: string;
  author: string;
  frames: string[];
}

// Sample data - sostituisci con i tuoi dati reali
const getAudiobooks = (): AudiobookGallery[] => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return [
    {
      id: 'dungeon-crawler-carl',
      title: 'Dungeon Crawler Carl',
      author: 'Matt Dinniman',
      frames: [
        `${baseUrl}Imgs/preview-dungeon-crawler-carl-pee-scene.png`,
        `${baseUrl}Imgs/Dungeon-Crawl%20Carl-Demons-arise.jpeg`,
        `${baseUrl}Imgs/Dungeon-Crawl%20Carl-Donut-attack.jpeg`,
        `${baseUrl}Imgs/Dungeon-Crawl%20Carl-Donut.jpeg`,
        `${baseUrl}Imgs/Dungeon-Crawl%20Carl-Enemy.jpeg`,
        `${baseUrl}Imgs/Dungeon-Crawl%20Carl-fire-station.jpeg`,
      ]
    },
    // Aggiungi altri audiobook qui
  ];
};

const FramesGallery = ({ isOpen, onClose }: FramesGalleryProps) => {
  const [selectedBook, setSelectedBook] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState(0);

  if (!isOpen) {
    return null;
  }

  const audiobooks = getAudiobooks();

  const currentBook = audiobooks[selectedBook];
  const currentFrame = currentBook.frames[selectedFrame];

  const nextBook = () => {
    setSelectedBook((prev) => (prev + 1) % audiobooks.length);
    setSelectedFrame(0);
  };

  const prevBook = () => {
    setSelectedBook((prev) => (prev - 1 + audiobooks.length) % audiobooks.length);
    setSelectedFrame(0);
  };

  const nextFrame = () => {
    setSelectedFrame((prev) => (prev + 1) % currentBook.frames.length);
  };

  const prevFrame = () => {
    setSelectedFrame((prev) => (prev - 1 + currentBook.frames.length) % currentBook.frames.length);
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-[9999] flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{currentBook.title}</h2>
            <p className="text-gray-300 text-sm">by {currentBook.author}</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="text-white hover:text-[#17d4ff] transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Close gallery"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div 
        className="flex-1 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={currentFrame} 
          alt={`${currentBook.title} - Frame ${selectedFrame + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Navigation Controls - Only show if more than 1 frame */}
      {currentBook.frames.length > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
          {/* Previous Frame */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevFrame();
            }}
            className="pointer-events-auto ml-4 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all hover:scale-110"
            aria-label="Previous frame"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Next Frame */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextFrame();
            }}
            className="pointer-events-auto mr-4 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all hover:scale-110"
            aria-label="Next frame"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between">
          {/* Book Navigation */}
          <div className="flex items-center gap-4">
            {audiobooks.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevBook();
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Previous Book</span>
                </button>
                <span className="text-white text-sm">
                  {selectedBook + 1} / {audiobooks.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextBook();
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Next Book</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Frame Counter */}
          <div className="text-white text-sm bg-black/50 px-4 py-2 rounded-lg">
            Frame {selectedFrame + 1} / {currentBook.frames.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {currentBook.frames.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
            {currentBook.frames.map((frame, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFrame(index);
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedFrame 
                    ? 'border-[#17d4ff] scale-110' 
                    : 'border-white/30 hover:border-white/60'
                }`}
              >
                <img 
                  src={frame} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FramesGallery;