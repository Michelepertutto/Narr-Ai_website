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
  const scrollDirectionRef = useRef<'forward' | 'backward'>('forward');
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleInteraction = () => {
    if (hasInteractedRef.current) return;
    hasInteractedRef.current = true;
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
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
      // Vertical layout - mantiene larghezza piena, altezza aumenta in hover per 16:9
      return isHovered 
        ? 'w-full aspect-video' // 16:9 aspect ratio in hover
        : 'w-full h-[calc((100%-2rem)/3)]';
    } else {
      // Horizontal layout
      if (isExpanded) {
        return isHovered
          ? 'w-96 h-[216px]' // 16:9 ratio (384px x 216px)
          : 'w-64 h-44 sm:w-80 sm:h-56';
      } else {
        return isHovered
          ? 'w-80 h-[180px]' // 16:9 ratio (320px x 180px)
          : 'w-60 h-36 sm:w-80 sm:h-48';
      }
    }
  };
  
  const containerClasses = isMobileLandscape
    ? 'h-full flex flex-col overflow-y-auto space-y-4 scrollbar-hide snap-y snap-mandatory touch-pan-y'
    : 'flex overflow-x-auto space-x-4 scrollbar-hide snap-x snap-mandatory cursor-grab touch-pan-x';

  return (
    <div
      ref={scrollContainerRef}
      className={`carousel ${containerClasses}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onMouseEnter={handleInteraction}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          onClick={() => {
            handleInteraction(); // Stop scrolling on click as well
            onVideoSelect(index);
          }}
          onMouseEnter={() => {
            setHoveredIndex(index);
            const videoEl = videoRefs.current[index];
            if (videoEl) {
              videoEl.play().catch(() => {});
            }
          }}
          onMouseLeave={() => {
            setHoveredIndex(null);
            const videoEl = videoRefs.current[index];
            if (videoEl) {
              videoEl.pause();
              videoEl.currentTime = 0;
            }
          }}
          className={`video-item flex-shrink-0 relative rounded-xl overflow-hidden group snap-start cursor-pointer transition-all duration-300 ease-in-out ${getItemClasses(index)}`}
        >
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={video.videoUrl}
            poster={video.posterUrl || `https://picsum.photos/seed/${video.seed}/400/300`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loop
            playsInline
            preload="metadata"
            draggable={false}
            controls
            onError={() => {}}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-cyan-500/80 rounded-full p-3">
              <PlayIcon className="h-6 w-6 text-black" />
            </div>
          </div>
          <p className="absolute bottom-2 left-3 text-white text-sm font-semibold">
            {video.title}
          </p>
        </div>
      ))}
      <style>{`
        /* Hide scrollbar but keep scrollability */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .grabbing { cursor: grabbing; user-select: none; }
      `}</style>
    </div>
  );
};

export default VideoCarousel;