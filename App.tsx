import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoCarousel from './components/VideoCarousel';
import FullscreenPlayer from './components/FullscreenPlayer';

export interface Video {
  id: number;
  seed: string;
  title: string;
  videoUrl: string;
  posterUrl?: string;
}

const videos: Video[] = [
  { 
    id: 1, 
    seed: 'video1', 
    title: 'Dungeon Crawler Carl Old man pee', 
    videoUrl: `${import.meta.env.BASE_URL}video/Dungeon-Crawler-Carl-Old-man-pee.mp4`,
    posterUrl: `${import.meta.env.BASE_URL}Imgs/preview-dungeon-crawler-carl-pee-scene.png`
  },
];

const App = () => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const landscapeQuery = window.matchMedia("(orientation: landscape) and (max-height: 500px)");
    const handleOrientationChange = (e: MediaQueryListEvent) => setIsMobileLandscape(e.matches);
    landscapeQuery.addEventListener('change', handleOrientationChange);
    setIsMobileLandscape(landscapeQuery.matches);

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);

    setTimeout(() => setIsLoaded(true), 100);

    return () => {
      landscapeQuery.removeEventListener('change', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleVideoSelect = (index: number) => setSelectedVideoIndex(index);
  const handleClosePlayer = () => setSelectedVideoIndex(null);
  
  const useVerticalLayout = isDesktop || isMobileLandscape;
  const isExpanded = selectedVideoIndex !== null;

  // Calcola la larghezza dello slider in base allo stato hover
  const sliderWidth = useVerticalLayout 
    ? (isSliderHovered ? 'w-[70%]' : 'w-[15%]')
    : 'ml-5';
  
  // Calcola la larghezza del main in base allo stato hover dello slider
  const mainWidth = useVerticalLayout
    ? (isSliderHovered ? 'w-[30%]' : 'w-[85%]')
    : 'w-[65%]';

  return (
    <>
      <div className="bg-white h-screen w-screen flex flex-col overflow-hidden box-border pb-5">
        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          {!useVerticalLayout && <Header />}
        </div>
        <div className={`flex-1 min-h-0 ${useVerticalLayout ? 'flex flex-row items-stretch gap-4 px-5' : 'flex flex-col'}`}>
          <main className={`${useVerticalLayout ? `${mainWidth} flex flex-col transition-all duration-300 ease-in-out` : 'flex-grow-0 sm:flex-grow flex flex-col px-2 sm:px-5'}`}>
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              {useVerticalLayout && <Header />}
            </div>
            <div className={`relative w-full rounded-xl sm:rounded-2xl shadow-2xl mt-5 overflow-hidden ${useVerticalLayout ? 'flex-1' : 'h-[60vh] sm:h-full'}`}>
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
              <div className="relative h-full flex flex-col justify-between items-center text-center">
                <Hero isMobileLandscape={isMobileLandscape} />
              </div>
            </div>
          </main>
          <div
            className={`${sliderWidth} mt-5 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
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
    </>
  );
};
export default App;