import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/narrai', '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#182131] text-gray-300 rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        
        <h3 id="modal-title" className="text-2xl font-bold mb-6 text-white text-center">Request Coherent Videos for Audiobooks</h3>
        
        <form className="space-y-5">
          <div>
            <label htmlFor="audiobook-link" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              Audiobook Link
            </label>
            <input 
              type="url" 
              id="audiobook-link" 
              placeholder="https://example.com/audiobook" 
              className="w-full px-4 py-2.5 bg-[#374151] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
          </div>
          
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#182131] text-gray-500">or</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-400">
              Upload Audiobook File
            </label>
            <a
              href="https://drive.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-full border-0 text-sm font-semibold bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors cursor-pointer"
            >
              Scegli file
            </a>
          </div>
          
          <div>
            <label htmlFor="story-part" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              Which part of the story for the video?
            </label>
            <textarea 
              id="story-part" 
              rows={3} 
              placeholder="e.g., Chapter 5, when the hero finds the sword..."
              className="w-full px-4 py-2.5 bg-[#374151] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"
            ></textarea>
          </div>
          
          <div className="pt-4 flex items-center gap-3">
            <button 
              type="button"
              onClick={handleDonateClick}
              className="w-2/5 bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
            >
              Donate 20€
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;