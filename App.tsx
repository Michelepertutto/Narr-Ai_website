

import React, { useState } from 'react';
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


const App: React.FC = () => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isCarouselActive, setIsCarouselActive] = useState(false);

  const handleVideoSelect = (index: number) => {
    setSelectedVideoIndex(index);
  };

  const handleClosePlayer = () => {
    setSelectedVideoIndex(null);
  };

  const isExpanded = isCarouselActive || selectedVideoIndex !== null;

  return (
    <>
      {showSplash && <SplashScreen onAnimationEnd={() => setShowSplash(false)} />}
      <div className="bg-white h-screen w-screen flex flex-col">
        <Header />
        <main className="flex-grow-0 sm:flex-grow flex flex-col px-2 sm:px-5 min-h-0">
          <div className="relative w-full h-[60vh] sm:h-full rounded-xl sm:rounded-2xl shadow-2xl mt-5">
            <video
              src="https://adobespark-cdn-assets.adobe.com/resource-store/urn:aaid:sc:US:f69c8893-6861-4a65-a115-2e0aa336d95b/v/1-5c8c/video.mp4"
              poster="https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-xl sm:rounded-2xl"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/50 rounded-xl sm:rounded-2xl"></div>
            <div className="relative h-full flex flex-col justify-between items-center text-center">
              <Hero />
            </div>
          </div>
        </main>
        <div
          className="px-2 sm:px-5"
          onMouseEnter={() => setIsCarouselActive(true)}
          onMouseLeave={() => setIsCarouselActive(false)}
        >
          <VideoCarousel
            videos={videos}
            onVideoSelect={handleVideoSelect}
            isExpanded={isExpanded}
          />
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