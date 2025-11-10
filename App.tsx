import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoCarousel, { SliderProgressBar } from './components/VideoCarousel';
import FullscreenPlayer from './components/FullscreenPlayer';
import ComingNextModal from './components/ComingNextModal';

export interface Video {
  id: number;
  seed: string;
  title: string;
  videoUrl: string;
  posterUrl?: string;
  bookCoverUrl?: string; // Book cover image
  audibleUrl?: string; // Link to Audible audiobook
  views?: number; // View count
  likes?: number; // Like count
  episodes?: Video[]; // For series with multiple episodes
  episodeNumber?: number; // Episode number within a series
}

const videos: Video[] = [
  { 
    id: 0, 
    seed: 'hero-background', 
    title: 'AI videos for Audiobooks', 
    videoUrl: `${import.meta.env.BASE_URL}video/video-ai-per-audiolibri.mp4`,
    posterUrl: `${import.meta.env.BASE_URL}Imgs/Poster-video-background.png`,
    views: 1250,
    likes: 89
  },
  { 
    id: 1, 
    seed: 'video1', 
    title: 'Dungeon Crawler Carl', 
    videoUrl: `${import.meta.env.BASE_URL}video/Dungeon-Crawler-Carl-Old-man-pee.mp4`,
    posterUrl: `${import.meta.env.BASE_URL}Imgs/preview-dungeon-crawler-carl-pee-scene.png`,
    bookCoverUrl: `${import.meta.env.BASE_URL}Imgs/Book Covers/Dungeon-Crawler-Carl.png`,
    audibleUrl: 'https://www.audible.it/pd/Dungeon-Crawler-Carl-Audiolibri/B0FVXCDZGK',
    views: 2340,
    likes: 156
  },
  { 
    id: 2, 
    seed: 'video2', 
    title: 'We are legion (We are Bob)', 
    videoUrl: `${import.meta.env.BASE_URL}video/Bobiverse_Bob-dies-and-wakes-up-as-AI.mp4`,
    posterUrl: `${import.meta.env.BASE_URL}Imgs/Poster_Bobiverse.png`,
    bookCoverUrl: `${import.meta.env.BASE_URL}Imgs/Book Covers/We-Are-Legion-We-Are-Bob.png`,
    audibleUrl: 'https://www.audible.it/pd/We-Are-Legion-We-Are-Bob-Audiolibri/B079BBMXKX',
    views: 1890,
    likes: 142
  },
  { 
    id: 3, 
    seed: 'video3', 
    title: 'La Sicaria', 
    videoUrl: `${import.meta.env.BASE_URL}video/La-Sicaria_Scena-1-Prince-karek.mp4`,
    posterUrl: `${import.meta.env.BASE_URL}Imgs/Poster-La-sicaria-Prince-Karek.png`,
    bookCoverUrl: `${import.meta.env.BASE_URL}Imgs/Book Covers/La-Sicaria.png`,
    episodeNumber: 1,
    episodes: [
      {
        id: 3,
        seed: 'video3',
        title: 'La Sicaria - Episode 1',
        videoUrl: `${import.meta.env.BASE_URL}video/La-Sicaria_Scena-1-Prince-karek.mp4`,
        posterUrl: `${import.meta.env.BASE_URL}Imgs/Poster-La-sicaria-Prince-Karek.png`,
        bookCoverUrl: `${import.meta.env.BASE_URL}Imgs/Book Covers/La-Sicaria.png`,
        episodeNumber: 1
      },
      {
        id: 4,
        seed: 'video4',
        title: 'La Sicaria - Episode 2',
        videoUrl: `${import.meta.env.BASE_URL}video/La_sicaria_The-arrival-of-the-assassin.mp4`,
        posterUrl: `${import.meta.env.BASE_URL}Imgs/Poster_La-sicaria.png`,
        bookCoverUrl: `${import.meta.env.BASE_URL}Imgs/Book Covers/La-Sicaria.png`,
        episodeNumber: 2
      }
    ]
  },
  { 
    id: 5, 
    seed: 'video5', 
    title: 'Warrior', 
    videoUrl: `${import.meta.env.BASE_URL}video/Warrior.mp4`,
    posterUrl: `${import.meta.env.BASE_URL}Imgs/Poster_Warrior.png`
  },
];

const App = () => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900);
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isComingNextOpen, setIsComingNextOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isCtaExpanded, setIsCtaExpanded] = useState(false);
  const [isSliderFullscreen, setIsSliderFullscreen] = useState(false);
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHorizontalMenuOpen, setIsHorizontalMenuOpen] = useState(false);

  useEffect(() => {
    const landscapeQuery = window.matchMedia("(orientation: landscape) and (max-height: 500px)");
    const handleOrientationChange = (e: MediaQueryListEvent) => setIsMobileLandscape(e.matches);
    landscapeQuery.addEventListener('change', handleOrientationChange);
    setIsMobileLandscape(landscapeQuery.matches);

    const portraitQuery = window.matchMedia("(orientation: portrait)");
    const handlePortraitChange = (e: MediaQueryListEvent) => setIsPortrait(e.matches);
    portraitQuery.addEventListener('change', handlePortraitChange);
    setIsPortrait(portraitQuery.matches);

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 900);
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };
    window.addEventListener('resize', handleResize);

    setTimeout(() => setIsLoaded(true), 100);

    return () => {
      landscapeQuery.removeEventListener('change', handleOrientationChange);
      portraitQuery.removeEventListener('change', handlePortraitChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Flatten videos for fullscreen player (expand series into individual videos)
  const flattenedVideos = videos.flatMap(video => 
    video.episodes && video.episodes.length > 0 ? video.episodes : [video]
  );

  const handleVideoSelect = (index: number) => {
    // Map carousel index to flattened index
    const selectedVideo = videos[index];
    if (selectedVideo.episodes && selectedVideo.episodes.length > 0) {
      // If it's a series, find the index of the first episode in flattened array
      const flatIndex = flattenedVideos.findIndex(v => v.id === selectedVideo.episodes![0].id);
      setSelectedVideoIndex(flatIndex);
    } else {
      // Find the index in flattened array
      const flatIndex = flattenedVideos.findIndex(v => v.id === selectedVideo.id);
      setSelectedVideoIndex(flatIndex);
    }
  };
  
  const handleClosePlayer = () => setSelectedVideoIndex(null);
  
  const handleFullscreenToggle = () => {
    setIsSliderFullscreen(!isSliderFullscreen);
  };
  
  const handleWatchClick = () => {
    // Open the hero background video (id: 0) in fullscreen
    setSelectedVideoIndex(0);
  };
  
  // Use horizontal layout for desktop/tablet landscape, vertical layout for portrait/mobile
  const useHorizontalLayout = !isPortrait;
  const isExpanded = selectedVideoIndex !== null;
  const isDesktopView = isDesktop && !isPortrait;

  // Filter videos by search query
  const filteredVideos = searchQuery.trim() === '' 
    ? videos 
    : videos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      {/* HORIZONTAL LAYOUT (Desktop/Tablet Landscape) */}
      {useHorizontalLayout ? (
        <div className="bg-white h-screen w-screen flex flex-col overflow-hidden">
          {/* Header: Logo only */}
          <div className="relative z-[10000] bg-white header-padding">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={`${import.meta.env.BASE_URL}Imgs/Narrai-Pictogram.png`} alt="Narr-Ai Logo" className="w-8 h-8" />
                <h1 className="logo text-2xl tracking-tighter text-black">Narr-Ai</h1>
              </div>
              {/* Hamburger menu for screens < 900px in horizontal layout */}
              {!isDesktop && (
                <button 
                  onClick={() => setIsHorizontalMenuOpen(!isHorizontalMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex flex-col gap-1.5"
                  aria-label="Toggle menu"
                >
                  <div className="w-6 h-0.5 bg-[#17d4ff] rounded"></div>
                  <div className="w-6 h-0.5 bg-[#17d4ff] rounded"></div>
                </button>
              )}
            </div>
          </div>
          
          {/* Search + Fullscreen (above slider) - Absolute positioned */}
          {isDesktopView && (
            <div className="absolute top-[10px] right-[20px] z-[10001] flex items-center gap-3 search-container">
              <div className="flex-1 flex items-center gap-2 bg-gray-300 rounded-xl px-3 py-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-600" 
                />
              </div>
              <button onClick={handleFullscreenToggle} className="w-10 h-10 bg-gray-300 rounded-xl flex items-center justify-center flex-shrink-0">
                {isSliderFullscreen ? (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
            </div>
          )}
          
          {/* Main Content: Hero + Slider */}
          <div className="flex-1 flex flex-row overflow-hidden main-content-padding">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col hero-margin-right">
              {/* Collab + Coming Next buttons above hero - desktop only */}
              {isDesktop && (
                <div className="flex items-center gap-6 justify-end mb-3">
                  <button onClick={() => setIsCollabOpen(true)} className="menu-item text-black hover:text-[#17d4ff] transition-colors">
                    Collab
                  </button>
                  <button onClick={() => setIsComingNextOpen(true)} className="menu-item text-black hover:text-[#17d4ff] transition-colors">
                    Coming Next
                  </button>
                </div>
              )}
              <div className={`relative flex-1 rounded-3xl shadow-2xl overflow-hidden ${!isDesktop ? 'hero-max-height' : ''}`}>
                <video
                  src={`${import.meta.env.BASE_URL}video/video-ai-per-audiolibri.mp4`}
                  poster={`${import.meta.env.BASE_URL}Imgs/Poster-video-background.png`}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/50 rounded-3xl pointer-events-none"></div>
                <div className="relative h-full flex items-center justify-center">
                  <Hero isMobileLandscape={false} onWatchClick={handleWatchClick} />
                </div>
              </div>
              {/* Footer - Privacy left, Love centered */}
              <div className="relative flex items-center justify-center text-sm footer-padding-top">
                <a href="#" className="absolute left-0 text-gray-600 hover:text-[#17d4ff] transition-colors">
                  Privacy Policy
                </a>
                <p className="text-gray-600 text-center">
                  If everyone reading this gave just $5, we'd be funded for the entire year. Be the one who helps. Chip in <a href="https://buymeacoffee.com/narrai" target="_blank" rel="noopener noreferrer" className="text-[#17d4ff] hover:underline">here</a>.
                </p>
              </div>
            </div>
            
            {/* Right: Slider - Extends below screen */}
            {useHorizontalLayout && (
              <div 
                className="flex flex-col transition-all duration-300" 
                style={{ 
                  width: isSliderFullscreen ? '100vw' : '280px', 
                  flexShrink: 0, 
                  height: 'calc(100% + 20px)',
                  position: isSliderFullscreen ? 'fixed' : 'relative',
                  top: isSliderFullscreen ? 0 : 'auto',
                  right: isSliderFullscreen ? 0 : 'auto',
                  zIndex: isSliderFullscreen ? 10000 : 'auto',
                  backgroundColor: isSliderFullscreen ? 'white' : 'transparent',
                  padding: isSliderFullscreen ? '20px' : '0'
                }}
              >
                <VideoCarousel
                  videos={filteredVideos}
                  onVideoSelect={handleVideoSelect}
                  isExpanded={isExpanded}
                  isMobileLandscape={true}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VERTICAL LAYOUT (Portrait/Mobile) */
        <div className="bg-white min-h-screen w-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center portrait-header-padding">
            <Header 
              onCollabClick={() => setIsCollabOpen(true)} 
              onComingNextClick={() => setIsComingNextOpen(true)}
              onFullscreenClick={handleFullscreenToggle}
            />
          </div>
          
          {/* Hero */}
          <div className="relative rounded-3xl shadow-2xl overflow-hidden portrait-hero-container">
            <video
              src={`${import.meta.env.BASE_URL}video/video-ai-per-audiolibri.mp4`}
              poster={`${import.meta.env.BASE_URL}Imgs/Poster-video-background.png`}
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/50 rounded-3xl pointer-events-none"></div>
            <div className="relative h-full flex items-center justify-center">
              <Hero isMobileLandscape={false} onWatchClick={handleWatchClick} />
            </div>
          </div>
          
          {/* Search Bar + Fullscreen */}
          <div className="flex items-center gap-3 portrait-search-margin">
            <div className="flex-1 flex items-center gap-3 bg-gray-300 rounded-xl px-4 py-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-600"
              />
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <button 
              onClick={handleFullscreenToggle}
              className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center"
            >
              {isSliderFullscreen ? (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Slider */}
          <div className="w-full portrait-slider-container">
            <VideoCarousel
              videos={filteredVideos}
              onVideoSelect={handleVideoSelect}
              isExpanded={isExpanded}
              isMobileLandscape={false}
            />
          </div>
          
          {/* Progress Bar */}
          <div className="portrait-progress-margin">
            <SliderProgressBar currentIndex={currentSliderIndex} totalItems={filteredVideos.length} />
          </div>
          
          {/* Footer */}
          <div className="flex flex-col items-center gap-2 text-sm text-gray-600 portrait-footer-padding">
            <a href="#" className="hover:text-[#17d4ff] transition-colors">
              Privacy Policy
            </a>
            <p className="text-center">
              If everyone reading this gave just $5, we'd be funded for the entire year. Be the one who helps. Chip in <a href="https://buymeacoffee.com/narrai" target="_blank" rel="noopener noreferrer" className="text-[#17d4ff] hover:underline">here</a>.
            </p>
          </div>
        </div>
      )}

      {selectedVideoIndex !== null && (
        <FullscreenPlayer
          videos={flattenedVideos}
          startIndex={selectedVideoIndex}
          onClose={handleClosePlayer}
        />
      )}
      
      {/* Modals rendered at root level to ensure proper z-index */}
      <ComingNextModal isOpen={isComingNextOpen} onClose={() => setIsComingNextOpen(false)} />
      {isCollabOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] p-4 sm:p-6" 
          onClick={() => setIsCollabOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-2xl relative animate-fadeIn" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsCollabOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Collaborate With Us</h2>
            
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              We're always looking for talented creators, voice actors, and audiobook enthusiasts to collaborate with.
            </p>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📹 Content Creators</h3>
                <p className="text-gray-600 text-sm">
                  Help us bring more audiobook scenes to life with your creative vision and video production skills.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎙️ Voice Actors</h3>
                <p className="text-gray-600 text-sm">
                  Lend your voice to iconic characters and help create immersive audiobook experiences.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Publishers & Authors</h3>
                <p className="text-gray-600 text-sm">
                  Partner with us to create promotional video content for your audiobooks.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-5 bg-[#17d4ff]/10 border border-[#17d4ff]/30 rounded-xl">
              <p className="text-sm text-gray-700 text-center leading-relaxed mb-4">
                Interested in collaborating? Get in touch!
              </p>
              <a 
                href="mailto:contact@narr-ai.online" 
                className="block w-full text-center px-6 py-3 bg-[#17d4ff] hover:bg-[#15bde6] text-black font-semibold rounded-xl transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Horizontal Layout Mobile Menu (< 900px) */}
      {isHorizontalMenuOpen && useHorizontalLayout && (
        <>
          {/* ... (rest of the code remains the same) */}
          <div 
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => setIsHorizontalMenuOpen(false)}
          />
          {/* Menu */}
          <div className="fixed top-[70px] left-4 right-4 bg-black rounded-3xl shadow-2xl overflow-hidden z-[9999]" style={{ padding: '30px' }}>
            {/* Close button */}
            <button
              onClick={() => setIsHorizontalMenuOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col gap-6 mb-8">
              <button
                onClick={() => { setIsComingNextOpen(true); setIsHorizontalMenuOpen(false); }}
                className="menu-item flex justify-between items-center text-left text-white hover:text-[#17d4ff] transition-colors py-2"
              >
                <span className="text-xl">Coming Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => { setIsCollabOpen(true); setIsHorizontalMenuOpen(false); }}
                className="menu-item flex justify-between items-center text-left text-white hover:text-[#17d4ff] transition-colors py-2"
              >
                <span className="text-xl">Collab</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default App;