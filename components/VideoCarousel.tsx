import React, { useRef, useEffect, useState } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import type { Video } from '../App';

interface VideoCarouselProps {
  videos: Video[];
  onVideoSelect: (index: number) => void;
  isExpanded: boolean;
  isMobileLandscape: boolean;
}

const VideoCarousel = ({ videos, onVideoSelect, isExpanded, isMobileLandscape }: VideoCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);
  const hasInteractedRef = useRef(false);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const scrollDirectionRef = useRef<'forward' | 'backward'>('forward');
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleInteraction = () => {
    if (hasInteractedRef.current) return;
    hasInteractedRef.current = true;
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
  };

  // Load liked videos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('narr-ai-liked-videos');
    if (stored) {
      try {
        const likedIds = JSON.parse(stored);
        setLikedVideos(new Set(likedIds));
      } catch (e) {
        console.error('Error loading liked videos:', e);
      }
    }
  }, []);

  // Handle like toggle
  const handleLike = (videoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedVideos(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(videoId)) {
        newLiked.delete(videoId);
      } else {
        newLiked.add(videoId);
      }
      // Save to localStorage
      localStorage.setItem('narr-ai-liked-videos', JSON.stringify(Array.from(newLiked)));
      return newLiked;
    });
  };

  // Auto-scroll logic - smooth continuous scrolling with direction reversal
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);

      autoScrollIntervalRef.current = window.setInterval(() => {
        if (hasInteractedRef.current || !scrollContainer.children.length) {
          if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
          return;
        }

        const scrollStep = 1;
        const isVertical = isMobileLandscape;
        const scrollPos = isVertical ? scrollContainer.scrollTop : scrollContainer.scrollLeft;
        const clientSize = isVertical ? scrollContainer.clientHeight : scrollContainer.clientWidth;
        const scrollSize = isVertical ? scrollContainer.scrollHeight : scrollContainer.scrollWidth;
        
        const isAtEnd = scrollPos + clientSize >= scrollSize - 1;
        const isAtStart = scrollPos <= 1;

        if (isAtEnd && scrollDirectionRef.current === 'forward') {
          scrollDirectionRef.current = 'backward';
        } else if (isAtStart && scrollDirectionRef.current === 'backward') {
          scrollDirectionRef.current = 'forward';
        }

        const delta = scrollDirectionRef.current === 'forward' ? scrollStep : -scrollStep;
        if (isVertical) {
          scrollContainer.scrollTop += delta;
        } else {
          scrollContainer.scrollLeft += delta;
        }
      }, 20); // 20ms = ~50fps per animazione fluida
    };

    const initialTimeout = setTimeout(startAutoScroll, 2000); // Start after 2 seconds

    return () => {
      clearTimeout(initialTimeout);
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isMobileLandscape]); // This effect runs only once on mount

  const handleDragStart = (pageX: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isMobileLandscape) return;

    handleInteraction();

    isDraggingRef.current = true;
    startXRef.current = pageX - scrollContainer.offsetLeft;
    startScrollLeftRef.current = scrollContainer.scrollLeft;

    scrollContainer.classList.add('grabbing');
  };

  const handleDragMove = (pageX: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (!isDraggingRef.current || !scrollContainer || isMobileLandscape) return;

    const x = pageX - scrollContainer.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Drag sensitivity
    scrollContainer.scrollLeft = startScrollLeftRef.current - walk;
  };

  const handleDragEnd = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !isDraggingRef.current || isMobileLandscape) return;

    isDraggingRef.current = false;
    scrollContainer.classList.remove('grabbing');
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.pageX);
    const onTouchMove = (e: TouchEvent) => e.touches[0] && handleDragMove(e.touches[0].pageX);

    const onMouseUp = () => handleDragEnd();
    const onTouchEnd = () => handleDragEnd();

    if (!isMobileLandscape) {
      // Global listeners for dragging outside the component
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);

      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('touchcancel', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);

      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isMobileLandscape]); // run when orientation changes

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleDragStart(e.pageX);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleInteraction();
    if (e.touches[0]) {
      handleDragStart(e.touches[0].pageX);
    }
  };

  const getItemClasses = (index: number) => {
    const isHovered = hoveredIndex === index;
    
    if (isMobileLandscape) {
      // Vertical layout - larger cards for horizontal tablet/mobile
      return `w-full min-h-[240px] transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`;
    } else {
      // Horizontal layout - mobile portrait
      return `w-[160px] h-[180px] transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`;
    }
  };
  
  const containerClasses = isMobileLandscape
    ? 'h-full flex flex-col overflow-y-auto scrollbar-hide snap-y snap-mandatory touch-pan-y'
    : 'h-full flex overflow-x-auto scrollbar-hide snap-x snap-mandatory cursor-grab touch-pan-x';

  const gapStyle = { gap: '15px' };

  return (
    <div
      ref={scrollContainerRef}
      className={`carousel ${containerClasses}`}
      style={gapStyle}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onMouseEnter={handleInteraction}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          onClick={() => {
            handleInteraction();
            onVideoSelect(index);
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`video-item flex-shrink-0 relative rounded-2xl overflow-hidden snap-start cursor-pointer transition-all duration-300 ease-in-out ${getItemClasses(index)}`}
          style={{
            backgroundImage: `url(${video.posterUrl || `https://picsum.photos/seed/${video.seed}/400/300`})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Card Header */}
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-10">
            <span className="text-white text-sm font-normal">{video.title}</span>
            <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h12V4H6zm2 2h8v2H8V6zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/>
              </svg>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
            {/* Link to audiobook button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Link to Audible with specific book URL or generic Audible.it
                const audibleLink = video.audibleUrl || 'https://www.audible.it';
                window.open(audibleLink, '_blank', 'noopener,noreferrer');
              }}
              className="w-8 h-8 bg-gray-600/80 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors"
              title="View on Audible"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            {/* Download button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = video.videoUrl;
                link.download = `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-8 h-8 bg-gray-600/80 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors"
              title="Download"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>

          {/* Bottom Right Counters: Views and Likes */}
          <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1 z-10">
            {/* Views */}
            <div className="flex items-center gap-1">
              <span className="text-white text-xs font-medium">{video.views || 0}</span>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </div>
            {/* Likes */}
            <button
              onClick={(e) => handleLike(video.id, e)}
              className="flex items-center gap-1 transition-transform hover:scale-110"
            >
              <span className="text-white text-xs font-medium">{(video.likes || 0) + (likedVideos.has(video.id) ? 1 : 0)}</span>
              <svg 
                className={`w-4 h-4 transition-colors ${
                  likedVideos.has(video.id) ? 'text-red-500 fill-current' : 'text-white'
                }`} 
                fill={likedVideos.has(video.id) ? 'currentColor' : 'none'}
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      {isMobileLandscape && (
        <SliderProgressBar currentIndex={hoveredIndex || 0} totalItems={videos.length} />
      )}
      <style>{`
        /* Hide scrollbar but keep scrollability */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .grabbing { cursor: grabbing; user-select: none; }
      `}</style>
    </div>
  );
};

// Progress bar component for mobile slider
export const SliderProgressBar = ({ currentIndex, totalItems }: { currentIndex: number; totalItems: number }) => {
  const progress = ((currentIndex + 1) / totalItems) * 100;
  return (
    <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#17d4ff] transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default VideoCarousel;