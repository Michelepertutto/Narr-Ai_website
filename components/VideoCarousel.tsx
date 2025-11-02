

import React, { useRef, useEffect } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import type { Video } from '../App';

interface VideoCarouselProps {
  videos: Omit<Video, 'videoUrl'>[];
  onVideoSelect: (index: number) => void;
  isExpanded: boolean;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos, onVideoSelect, isExpanded }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<number | null>(null);
  const hasInteractedRef = useRef(false);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    autoScrollTimerRef.current = window.setTimeout(() => {
      if (hasInteractedRef.current || !scrollContainer.children.length) return;

      const firstItem = scrollContainer.children[0] as HTMLElement;
      const gap = parseFloat(window.getComputedStyle(scrollContainer).gap || '16px');
      const scrollAmount = firstItem.offsetWidth + gap;
      scrollContainer.scrollTo({ left: scrollContainer.scrollLeft + scrollAmount, behavior: 'smooth' });
    }, 2000);

    return () => {
      if (autoScrollTimerRef.current) {
        clearTimeout(autoScrollTimerRef.current);
      }
    };
  }, []);

  const handleInteraction = () => {
    if (hasInteractedRef.current) return;
    hasInteractedRef.current = true;
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
    }
  };

  const handleDragStart = (pageX: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    handleInteraction();

    isDraggingRef.current = true;
    startXRef.current = pageX - scrollContainer.offsetLeft;
    startScrollLeftRef.current = scrollContainer.scrollLeft;

    scrollContainer.classList.add('grabbing');
  };

  const handleDragMove = (pageX: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (!isDraggingRef.current || !scrollContainer) return;

    const x = pageX - scrollContainer.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Drag sensitivity
    scrollContainer.scrollLeft = startScrollLeftRef.current - walk;
  };

  const handleDragEnd = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !isDraggingRef.current) return;

    isDraggingRef.current = false;
    scrollContainer.classList.remove('grabbing');
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.pageX);
    const onTouchMove = (e: TouchEvent) => e.touches[0] && handleDragMove(e.touches[0].pageX);

    const onMouseUp = () => handleDragEnd();
    const onTouchEnd = () => handleDragEnd();

    // Global listeners for dragging outside the component
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);

      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []); // run once

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleDragStart(e.pageX);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handleDragStart(e.touches[0].pageX);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="carousel flex overflow-x-auto space-x-4 py-5 scrollbar-hide snap-x snap-mandatory cursor-grab"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {videos.map((video, index) => {
        const itemClasses = isExpanded
          ? 'w-64 h-44 sm:w-80 sm:h-56'
          : 'w-60 h-36 sm:w-80 sm:h-48';

        return (
          <div
            key={video.id}
            onClick={() => onVideoSelect(index)}
            className={`video-item flex-shrink-0 relative rounded-xl overflow-hidden group snap-start cursor-pointer transition-all duration-300 ease-in-out ${itemClasses}`}
          >
            <img
              src={`https://picsum.photos/seed/${video.seed}/400/300`}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              draggable="false"
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
        );
      })}
      <style>{`
        /* Hide scrollbar but keep scrollability */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; touch-action: pan-x; }

        .grabbing { cursor: grabbing; user-select: none; }

        /* Prevents horizontal scrollbar caused by 100vw */
        html, body {
          overflow-x: clip;
        }
      `}</style>
    </div>
  );
};

export default VideoCarousel;