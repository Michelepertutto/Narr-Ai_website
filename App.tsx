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

  const handleVideoSelect = (index: number) => setSelectedVideoIndex(index);
  const handleClosePlayer = () => setSelectedVideoIndex(null);
  
  // Use desktop layout only if screen is large AND in landscape, otherwise use mobile layout
  const useVerticalLayout = isDesktop && !isPortrait;
  const isExpanded = selectedVideoIndex !== null;

  // Calcola la larghezza dello slider in base allo stato hover
  const sliderWidth = useVerticalLayout 
    ? (isSliderHovered ? 'w-[60%]' : 'w-[40%]')
    : 'w-full px-10';
  
  // Calcola la larghezza del main in base allo stato hover dello slider
  const mainWidth = useVerticalLayout
    ? (isSliderHovered ? 'w-[40%]' : 'w-[60%]')
    : 'w-full';

  return (
    <>
      <div className="bg-white h-screen w-screen flex flex-col overflow-hidden box-border pb-10">
        <div className={`pt-[15px] px-10 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          {!useVerticalLayout && <Header onFramesClick={() => setIsFramesOpen(true)} onComingNextClick={() => setIsComingNextOpen(true)} />}
        </div>
        <div className={`flex-1 min-h-0 ${useVerticalLayout ? 'flex flex-row items-stretch gap-4 px-10' : 'flex flex-col'}`}>
          {/* Dark overlay when slider is hovered */}
          {useVerticalLayout && isSliderHovered && (
            <div className="fixed inset-0 bg-black/40 z-[100] pointer-events-none transition-opacity duration-300" />
          )}
          <main className={`${useVerticalLayout ? `${mainWidth} flex flex-col transition-all duration-300 ease-in-out relative z-[50]` : 'flex-grow-0 sm:flex-grow flex flex-col px-10'}`}>
            <div className={`pt-[15px] transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              {useVerticalLayout && <Header onFramesClick={() => setIsFramesOpen(true)} onComingNextClick={() => setIsComingNextOpen(true)} />}
            </div>
            <div className={`relative w-full rounded-xl sm:rounded-2xl shadow-2xl mt-3 overflow-hidden ${useVerticalLayout ? 'flex-1' : 'h-[calc(100vh-180px)] min-h-[500px] sm:h-full'}`}>
              {/* Video background */}
              <video
                src={`${import.meta.env.BASE_URL}video/video-ai-per-audiolibri.mp4`}
                poster={`${import.meta.env.BASE_URL}Imgs/Poster-video-background.png`}
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              
              {/* Velo scuro sopra al video per migliorare la leggibilità del testo */}
              <div className="absolute inset-0 bg-black/50 rounded-xl sm:rounded-2xl pointer-events-none"></div>
              
              {/* Contenitore per i contenuti testuali sopra al video */}
              <div className="relative h-full flex items-center justify-center">
                <Hero isMobileLandscape={isMobileLandscape} />
              </div>
            </div>
          </main>
          <div
            className={`${sliderWidth} transition-all duration-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'} ${useVerticalLayout ? 'relative z-[200]' : ''}`}
            style={{ 
              transitionDelay: isLoaded ? '0ms' : '500ms',
              marginTop: useVerticalLayout ? '15px' : '20px'
            }}
            onMouseEnter={() => useVerticalLayout && setIsSliderHovered(true)}
            onMouseLeave={() => useVerticalLayout && setIsSliderHovered(false)}
          >
            <VideoCarousel
              videos={videos}
              onVideoSelect={handleVideoSelect}
              isExpanded={isExpanded}
              isMobileLandscape={useVerticalLayout}
            />
          </div>
        </div>

        {selectedVideoIndex !== null && (
          <FullscreenPlayer
            videos={videos}
            startIndex={selectedVideoIndex}
            onClose={handleClosePlayer}
          />
        )}
      </div>
      
      {/* Modals rendered at root level to ensure proper z-index */}
      <ComingNextModal isOpen={isComingNextOpen} onClose={() => setIsComingNextOpen(false)} />
      <FramesGallery isOpen={isFramesOpen} onClose={() => setIsFramesOpen(false)} />
    </>
  );
};
export default App;