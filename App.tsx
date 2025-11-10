import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoCarousel from './components/VideoCarousel';
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
  const [isFramesOpen, setIsFramesOpen] = useState(false);
  const [isCtaExpanded, setIsCtaExpanded] = useState(false);

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
  
  // Use horizontal layout for desktop landscape, vertical layout for portrait/mobile
  const useHorizontalLayout = isDesktop && !isPortrait;
  const isExpanded = selectedVideoIndex !== null;

  return (
    <>
      {/* HORIZONTAL LAYOUT (Desktop Landscape) */}
      {useHorizontalLayout ? (
        <div className="bg-white h-screen w-screen flex flex-row overflow-hidden">
          {/* Left Column: Header + Hero + CTA */}
          <div className="flex-1 flex flex-col" style={{ margin: '15px 0 30px 30px' }}>
            {/* Sticky Header */}
            <div className="sticky top-0 z-[10000]" style={{ marginBottom: '15px' }}>
              <Header onFramesClick={() => setIsFramesOpen(true)} onComingNextClick={() => setIsComingNextOpen(true)} />
            </div>
            
            {/* Hero Section */}
            <div className="relative flex-1 rounded-xl shadow-2xl overflow-hidden" style={{ marginBottom: '30px' }}>
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
            
            {/* CTA Secondary Links */}
            <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
              <a href="https://buymeacoffee.com/narrai" target="_blank" rel="noopener noreferrer" className="hover:text-[#17d4ff] transition-colors">
                Support
              </a>
              <button className="flex items-center gap-2 hover:text-[#17d4ff] transition-colors">
                <span>Download app</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <a href="#" className="hover:text-[#17d4ff] transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
          
          {/* Right Column: Slider (Full Height) */}
          <div className="h-screen flex flex-col" style={{ paddingTop: '40px', paddingBottom: '40px', marginRight: '0' }}>
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
        <div className="bg-white h-[100dvh] w-screen flex flex-col overflow-hidden">
          {/* Header - 10dvh */}
          <div className="h-[10dvh] flex items-center" style={{ margin: '5px 30px' }}>
            <Header onFramesClick={() => setIsFramesOpen(true)} onComingNextClick={() => setIsComingNextOpen(true)} />
          </div>
          
          {/* Hero - 50dvh */}
          <div className="h-[50dvh] relative rounded-xl shadow-2xl overflow-hidden" style={{ margin: '0 30px 15px 30px' }}>
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
          
          {/* Slider - 30dvh */}
          <div className="h-[30dvh] w-full" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
            <VideoCarousel
              videos={videos}
              onVideoSelect={handleVideoSelect}
              isExpanded={isExpanded}
              isMobileLandscape={false}
            />
          </div>
          
          {/* CTA Footer - 10dvh (Collapsible) */}
          <div className="h-[10dvh] flex flex-col" style={{ margin: '0 30px' }}>
            {/* Collapsed state - just the toggle button */}
            {!isCtaExpanded && (
              <button
                onClick={() => setIsCtaExpanded(true)}
                className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-[#17d4ff] transition-colors"
              >
                <span className="text-sm font-medium">More options</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            
            {/* Expanded state - show links */}
            {isCtaExpanded && (
              <div className="flex flex-col gap-2 py-2">
                <button
                  onClick={() => setIsCtaExpanded(false)}
                  className="self-center text-gray-600 hover:text-[#17d4ff] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <div className="flex justify-center items-center gap-6 text-xs text-gray-600">
                  <a href="https://buymeacoffee.com/narrai" target="_blank" rel="noopener noreferrer" className="hover:text-[#17d4ff] transition-colors">
                    Support
                  </a>
                  <button className="flex items-center gap-1 hover:text-[#17d4ff] transition-colors">
                    <span>Download app</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <a href="#" className="hover:text-[#17d4ff] transition-colors">
                    Privacy
                  </a>
                </div>
              </div>
            )}
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
      <FramesGallery isOpen={isFramesOpen} onClose={() => setIsFramesOpen(false)} />
    </>
  );
};
export default App;