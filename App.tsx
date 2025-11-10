import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoCarousel, { SliderProgressBar } from './components/VideoCarousel';
import FullscreenPlayer from './components/FullscreenPlayer';
import ComingNextModal from './components/ComingNextModal';
import FramesGallery from './components/FramesGallery';

export interface Video {
  id: number;
  seed: string;
  title: string;
  videoUrl: string;
  posterUrl?: string;
  episodes?: Video[]; // For series with multiple episodes
  episodeNumber?: number; // Episode number within a series
}

const videos: Video[] = [
  { 
    id: 1, 
    seed: 'video1', 
    title: 'Dungeon Crawler Carl', 
    videoUrl: `${import.meta.env.BASE_URL}video/Dungeon-Crawler-Carl-Old-man-pee.mp4`,
    posterUrl: `${import.meta.env.BASE_URL}Imgs/preview-dungeon-crawler-carl-pee-scene.png`
  },
  { 
    id: 2, 
    seed: 'video2', 
    title: 'We are legion (We are Bob)', 
    videoUrl: `${import.meta.env.BASE_URL}video/Bobiverse_Bob-dies-and-wakes-up-as-AI.mp4`,
    posterUrl: `${import.meta.env.BASE_URL}Imgs/Poster_Bobiverse.png`
  },
  { 
    id: 3, 
    seed: 'video3', 
    title: 'La Sicaria', 
    videoUrl: `${import.meta.env.BASE_URL}video/La-Sicaria_Scena-1-Prince-karek.mp4`,
    posterUrl: `${import.meta.env.BASE_URL}Imgs/Poster-La-sicaria-Prince-Karek.png`,
    episodeNumber: 1,
    episodes: [
      {
        id: 3,
        seed: 'video3',
        title: 'La Sicaria - Episode 1',
        videoUrl: `${import.meta.env.BASE_URL}video/La-Sicaria_Scena-1-Prince-karek.mp4`,
        posterUrl: `${import.meta.env.BASE_URL}Imgs/Poster-La-sicaria-Prince-Karek.png`,
        episodeNumber: 1
      },
      {
        id: 4,
        seed: 'video4',
        title: 'La Sicaria - Episode 2',
        videoUrl: `${import.meta.env.BASE_URL}video/La_sicaria_The-arrival-of-the-assassin.mp4`,
        posterUrl: `${import.meta.env.BASE_URL}Imgs/Poster_La-sicaria.png`,
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
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isComingNextOpen, setIsComingNextOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isCtaExpanded, setIsCtaExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);

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
      setIsDesktop(window.innerWidth >= 1024);
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
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Use horizontal layout for desktop landscape, vertical layout for portrait/mobile
  const useHorizontalLayout = isDesktop && !isPortrait;
  const isExpanded = selectedVideoIndex !== null;

  return (
    <>
      {/* HORIZONTAL LAYOUT (Desktop Landscape) */}
      {useHorizontalLayout ? (
        <div className="bg-white h-screen w-screen flex flex-row overflow-hidden">
          {/* Left Column: Header + Hero + Footer */}
          <div className="flex-1 flex flex-col" style={{ padding: '10px 0 20px 20px' }}>
            {/* Sticky Header */}
            <div className="sticky top-0 z-[10000] bg-white" style={{ paddingBottom: '10px' }}>
              <Header 
                onCollabClick={() => setIsCollabOpen(true)} 
                onComingNextClick={() => setIsComingNextOpen(true)}
                onFullscreenClick={handleFullscreenToggle}
              />
            </div>
            
            {/* Hero Section */}
            <div className="relative flex-1 rounded-xl shadow-2xl overflow-hidden" style={{ marginRight: '20px' }}>
              <video
                src={`${import.meta.env.BASE_URL}video/video-ai-per-audiolibri.mp4`}
                poster={`${import.meta.env.BASE_URL}Imgs/Poster-video-background.png`}
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-black/50 rounded-xl pointer-events-none"></div>
              <div className="relative h-full flex items-center justify-center">
                <Hero isMobileLandscape={false} />
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center text-sm" style={{ paddingTop: '20px', marginRight: '20px' }}>
              <a href="#" className="text-gray-600 hover:text-[#17d4ff] transition-colors">
                Privacy Policy
              </a>
              <p className="text-gray-600 text-center">
                Love what we do? Then please support us <a href="https://buymeacoffee.com/narrai" target="_blank" rel="noopener noreferrer" className="text-[#17d4ff] hover:underline">here</a>.
              </p>
              <button className="cta-button px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2">
                <span>Watch</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right Column: Slider (Full Height) */}
          <div className="h-screen flex flex-col" style={{ padding: '20px 20px 20px 0' }}>
            <VideoCarousel
              videos={videos}
              onVideoSelect={handleVideoSelect}
              isExpanded={isExpanded}
              isMobileLandscape={true}
            />
          </div>
        </div>
      ) : (
        /* VERTICAL LAYOUT (Portrait/Mobile) */
        <div className="bg-white min-h-screen w-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center" style={{ padding: '15px 20px' }}>
            <Header 
              onCollabClick={() => setIsCollabOpen(true)} 
              onComingNextClick={() => setIsComingNextOpen(true)}
              onFullscreenClick={handleFullscreenToggle}
            />
          </div>
          
          {/* Hero */}
          <div className="relative rounded-3xl shadow-2xl overflow-hidden" style={{ margin: '0 20px 20px 20px', minHeight: '580px' }}>
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
              <Hero isMobileLandscape={false} />
            </div>
          </div>
          
          {/* Search Bar + Fullscreen */}
          <div className="flex items-center gap-3" style={{ margin: '0 20px 20px 20px' }}>
            <div className="flex-1 flex items-center gap-3 bg-gray-300 rounded-xl px-4 py-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search" 
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
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
          
          {/* Slider */}
          <div className="w-full" style={{ marginBottom: '10px', paddingLeft: '20px', height: '200px' }}>
            <VideoCarousel
              videos={videos}
              onVideoSelect={handleVideoSelect}
              isExpanded={isExpanded}
              isMobileLandscape={false}
              onSlideChange={(index) => setCurrentSliderIndex(index)}
            />
          </div>
          
          {/* Progress Bar */}
          <div style={{ margin: '0 20px 20px 20px' }}>
            <SliderProgressBar currentIndex={currentSliderIndex} totalItems={videos.length} />
          </div>
          
          {/* Footer */}
          <div className="flex flex-col items-center gap-2 text-sm text-gray-600" style={{ padding: '20px', marginTop: 'auto' }}>
            <a href="#" className="hover:text-[#17d4ff] transition-colors">
              Privacy Policy
            </a>
            <p className="text-center">
              Love what we do? Then please support us <a href="https://buymeacoffee.com/narrai" target="_blank" rel="noopener noreferrer" className="text-[#17d4ff] hover:underline">here</a>.
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
        <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center" onClick={() => setIsCollabOpen(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Collab</h2>
            <p>Collaboration features coming soon!</p>
            <button onClick={() => setIsCollabOpen(false)} className="mt-4 px-4 py-2 bg-[#17d4ff] text-black rounded-lg">Close</button>
          </div>
        </div>
      )}
    </>
  );
};
export default App;