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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[50000] p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-3xl max-h-[90vh] relative flex flex-col mx-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 z-10"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        
        <div className="overflow-y-auto pr-2 flex-1">
          <h3 id="coming-next-title" className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">
            Coming Next
          </h3>
          
          <p className="text-gray-600 mb-8 text-base">
            Upcoming video tributes to your favorite audiobook scenes
          </p>

          <div className="space-y-3">
            {upcomingVideos.map((video, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-[#17d4ff] hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 flex-1">{video.title}</h4>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
                    video.status === 'In Production' ? 'bg-green-100 text-green-700' :
                    video.status === 'Planned' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {video.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{video.date}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-[#17d4ff]/10 border border-[#17d4ff]/30 rounded-xl">
            <p className="text-sm text-gray-700 text-center leading-relaxed">
              Want to see a specific scene? Submit a request and support us with a donation!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingNextModal;