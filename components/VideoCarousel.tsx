import React, { useRef, useEffect, useState } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import type { Video } from '../App';

interface VideoCarouselProps {
  videos: Video[];
  onVideoSelect: (index: number) => void;
  isExpanded: boolean;
  isMobileLandscape: boolean;
  onSlideChange?: (index: number) => void;
}

const VideoCarousel = ({ videos, onVideoSelect, isExpanded, isMobileLandscape, onSlideChange }: VideoCarouselProps) => {
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

  // Track scroll position and update current index using Intersection Observer
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !onSlideChange) return;

    const options = {
      root: scrollContainer,
      rootMargin: '0px',
      threshold: 0.5 // Trigger when 50% of item is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const children = Array.from(scrollContainer.children) as HTMLElement[];
          const index = children.indexOf(entry.target as HTMLElement);
          if (index !== -1) {
            onSlideChange(index);
          }
        }
      });
    }, options);

    // Observe all video items
    Array.from(scrollContainer.children).forEach((child) => {
      observer.observe(child as Element);
    });

    return () => observer.disconnect();
  }, [onSlideChange, videos.length]);

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
      // Prevent iOS Safari from interfering with touch events
      if (!isMobileLandscape) {
        e.preventDefault();
      }
      handleDragStart(e.touches[0].pageX);
    }
  };

  const getItemClasses = (index: number) => {
    if (isMobileLandscape) {
      // Vertical layout - larger cards for horizontal tablet/mobile
      return `w-full min-h-[240px]`;
    } else {
      // Horizontal layout - mobile portrait with 16:9 aspect ratio
      return `w-[240px] h-[135px]`;
    }
  };

  const containerClasses = isMobileLandscape
    ? 'h-full flex flex-col overflow-y-auto scrollbar-hide touch-pan-y carousel-gap'
    : 'h-full flex overflow-x-auto scrollbar-hide cursor-grab touch-pan-x carousel-gap';

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
            handleInteraction();
            onVideoSelect(index);
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group ${getItemClasses(index)}`}
          style={{
            marginBottom: isMobileLandscape && index === videos.length - 1 ? '20px' : undefined,
            marginRight: !isMobileLandscape && index === videos.length - 1 ? '20px' : undefined
          }}
        >
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={video.videoUrl}
            poster={video.posterUrl}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            onMouseEnter={(e) => {
              const videoEl = e.currentTarget;
              videoEl.play().catch(() => {});
            }}
            onMouseLeave={(e) => {
              const videoEl = e.currentTarget;
              videoEl.pause();
              videoEl.currentTime = 0;
            }}
            style={{
              transform: 'translateZ(0)'
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {video.bookCoverUrl && (
            <div className="absolute top-4 left-4 w-12 h-16 rounded overflow-hidden shadow-lg z-10">
              <img 
                src={video.bookCoverUrl} 
                alt={`${video.title} cover`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Episodes Badge */}
          {video.episodes && video.episodes.length > 1 && (
          <div className="absolute top-2 left-2 bg-[#17d4ff] text-black px-2 py-1 rounded-md flex items-center gap-1 z-20 shadow-lg">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
            <span className="text-xs font-bold">{video.episodes.length}</span>
          </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <PlayIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white text-sm font-medium line-clamp-2">{video.title}</h3>
          </div>

          <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            {video.audibleUrl && (
              <a
                href={video.audibleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 bg-gray-600/80 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors"
                title="View on Audible"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
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

          <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1 z-10">
            <div className="flex items-center gap-1">
              <span className="text-white text-xs font-medium">{video.views || 0}</span>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </div>
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
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .grabbing { cursor: grabbing; user-select: none; }
      `}</style>
    </div>
  );
};

export default VideoCarousel;