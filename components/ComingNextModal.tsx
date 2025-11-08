import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ComingNextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingNextModal = ({ isOpen, onClose }: ComingNextModalProps) => {
  if (!isOpen) {
    return null;
  }

  const upcomingVideos = [
    { title: 'Dungeon Crawler Carl - Battle Scene', date: 'December 2024', status: 'In Production' },
    { title: 'The Martian - Survival Montage', date: 'January 2025', status: 'Planned' },
    { title: 'Project Hail Mary - First Contact', date: 'February 2025', status: 'Planned' },
    { title: 'Bobiverse - Replicant Awakening', date: 'March 2025', status: 'Concept' },
    { title: 'Red Rising - Institute Trials', date: 'April 2025', status: 'Concept' },
    { title: 'Mistborn - Allomancy Demo', date: 'May 2025', status: 'Concept' },
  ];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-next-title"
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[50000] p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-4xl h-auto max-h-[90vh] relative flex flex-col mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50 z-10"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        <div className="overflow-y-auto pr-2 flex-1">
          <h3 id="coming-next-title" className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Coming Next
          </h3>
          
          <p className="text-gray-300 text-center mb-8">
            Upcoming video tributes to your favorite audiobook scenes
          </p>

          <div className="space-y-4">
            {upcomingVideos.map((video, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 hover:border-cyan-500 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-white">{video.title}</h4>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    video.status === 'In Production' ? 'bg-green-500/20 text-green-400' :
                    video.status === 'Planned' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {video.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{video.date}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-sm text-cyan-300 text-center">
              💡 Want to see a specific scene? Submit a request and support us with a donation!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingNextModal;