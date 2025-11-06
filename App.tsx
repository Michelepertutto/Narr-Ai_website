import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoCarousel from './components/VideoCarousel';
import FullscreenPlayer from './components/FullscreenPlayer';
import SplashScreen from './components/SplashScreen';

export interface Video {
  id: number;
  seed: string;
  title: string;
  videoUrl: string;
}

const videos: Video[] = [
  { id: 1, seed: 'video1', title: 'Dungeon Crawler Carl Old man pee', videoUrl: '/video/Dungeon-Crawler-Carl-Old-man-pee.mp4' },
  { id: 2, seed: 'video2', title: 'Dungeon Crawl Carl Entrance', videoUrl: '/video/Dungeon-Crawl-Carl-Entrance.mp4' },
  { id: 3, seed: 'video3', title: 'Dungeon Crawl Carl elders', videoUrl: '/video/Dungeon-Crawl-Carl-elders.mp4' },
  { id: 4, seed: 'video4', title: 'Dungeon Crawl Carl power up', videoUrl: '/video/Dungeon-Crawl-Carl-power-up.mp4' },
  { id: 5, seed: 'video5', title: 'Dungeon Crawl Carl ready to fight', videoUrl: '/video/Dungeon-Crawl-Carl-ready-to-fight.mp4' },
  { id: 6, seed: 'video6', title: 'Dungeon Crawl Carl summon', videoUrl: '/video/Dungeon-Crawl-Carl-summon.mp4' },
];

const App = () => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  useEffect(() => {
    const landscapeQuery = window.matchMedia("(orientation: landscape) and (max-height: 500px)");
    const handleOrientationChange = (e: MediaQueryListEvent) => setIsMobileLandscape(e.matches);
    landscapeQuery.addEventListener('change', handleOrientationChange);
    setIsMobileLandscape(landscapeQuery.matches); // Initial check

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);

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
      {showSplash && <SplashScreen onAnimationEnd={() => setShowSplash(false)} />}
      <div className="bg-white h-screen w-screen flex flex-col overflow-hidden box-border pb-5">
        {!useVerticalLayout && <Header />}
        <div className={`flex-1 min-h-0 ${useVerticalLayout ? 'flex flex-row items-stretch gap-4 px-5' : 'flex flex-col'}`}>
          <main className={`${useVerticalLayout ? `${mainWidth} flex flex-col transition-all duration-300 ease-in-out` : 'flex-grow-0 sm:flex-grow flex flex-col px-2 sm:px-5'}`}>
            {useVerticalLayout && <Header />}
            <div className={`relative w-full rounded-xl sm:rounded-2xl shadow-2xl mt-5 overflow-hidden ${useVerticalLayout ? 'flex-1' : 'h-[60vh] sm:h-full'}`}>
              {/* Video background */}
              <video
                src="/video/video-ai-per-audiolibri.mp4"
                poster="/Imgs/Poster-video-background.png"
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
            className={`${sliderWidth} mt-5 transition-all duration-300 ease-in-out`}
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