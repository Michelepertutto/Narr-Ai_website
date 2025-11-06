

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