

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
  { id: 1, seed: 'video1', title: 'The Great Tale', videoUrl: 'https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4' },
  { id: 2, seed: 'video2', title: 'Whispers of Dawn', videoUrl: 'https://videos.pexels.com/video-files/853870/853870-hd_1920_1080_30fps.mp4' },
  { id: 3, seed: 'video3', title: 'Chronicles of the Void', videoUrl: 'https://videos.pexels.com/video-files/4434246/4434246-hd_1920_1080_25fps.mp4' },
  { id: 4, seed: 'video4', title: 'Echoes in Time', videoUrl: 'https://videos.pexels.com/video-files/7578516/7578516-hd_1920_1080_25fps.mp4' },
  { id: 5, seed: 'video5', title: "A Bard's Journey", videoUrl: 'https://videos.pexels.com/video-files/857195/857195-hd_1920_1080_30fps.mp4' },
  { id: 6, seed: 'video6', title: "Mountain's Secret", videoUrl: 'https://videos.pexels.com/video-files/854919/854919-hd_1920_1080_25fps.mp4' },
  { id: 7, seed: 'video7', title: 'The Last Stand', videoUrl: 'https://videos.pexels.com/video-files/2099392/2099392-hd_1920_1080_25fps.mp4' },
  { id: 8, seed: 'video8', title: 'Ocean Dreams', videoUrl: 'https://videos.pexels.com/video-files/5969502/5969502-hd_1920_1080_25fps.mp4' },
];


const App = () => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const landscapeQuery = window.matchMedia("(orientation: landscape) and (max-height: 500px)");
    const handleOrientationChange = (e: MediaQueryListEvent) => {
      setIsMobileLandscape(e.matches);
    };

    landscapeQuery.addEventListener('change', handleOrientationChange);
    setIsMobileLandscape(landscapeQuery.matches); // Initial check

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      landscapeQuery.removeEventListener('change', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleVideoSelect = (index: number) => {
    setSelectedVideoIndex(index);
  };

  const handleClosePlayer = () => {
    setSelectedVideoIndex(null);
  };
  
  const useVerticalLayout = isDesktop || isMobileLandscape;
  const isExpanded = selectedVideoIndex !== null;
return (
  <>
    {showSplash && <SplashScreen onAnimationEnd={() => setShowSplash(false)} />}
    <div className="bg-white h-screen w-screen flex flex-col overflow-hidden box-border pb-5">
      {!useVerticalLayout && <Header />}
      <div className={`flex-1 min-h-0 ${useVerticalLayout ? 'flex flex-row items-stretch gap-4 px-5' : 'flex flex-col'}`}>
        <main className={`${useVerticalLayout ? 'w-[65%] flex flex-col' : 'flex-grow-0 sm:flex-grow flex flex-col px-2 sm:px-5'}`}>
          {useVerticalLayout && <Header />}
          <div className={`relative w-full rounded-xl sm:rounded-2xl shadow-2xl mt-5 overflow-auto ${useVerticalLayout ? 'flex-1' : 'h-[60vh] sm:h-full'}`}>
        <video
         src="/video/video-ai-per-audiolibri.mp4"
         poster="/Imgs/Poster video background.png"
         className="absolute top-0 left-0 w-full h-full object-cover rounded-xl sm:rounded-2xl"
          autoPlay
          loop
         muted
         playsInline
        />
            <div className="absolute inset-0 bg-black/50 rounded-xl sm:rounded-2xl"></div>
            <div className="relative h-full flex flex-col justify-between items-center text-center">
              <Hero isMobileLandscape={isMobileLandscape} />
            </div>
          </div>
        </main>
        <div
          className={`${useVerticalLayout ? 'w-[35%]' : 'ml-5'} mt-5`}
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