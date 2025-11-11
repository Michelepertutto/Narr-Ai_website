import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const RequestModal = ({ isOpen, onClose, email = '' }: RequestModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/narrai', '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10001] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#182131] text-gray-300 rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        
        <form 
          action="https://formsubmit.co/m.caddeo@easytaskdesign.com" 
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* FormSubmit Configuration */}
          <input type="hidden" name="_subject" value="New Audiobook Request from Narr-AI" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          {email && <input type="hidden" name="user_email" value={email} />}
          
          <div>
            <label htmlFor="audiobook-link" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              Audiobook Link
            </label>
            <input 
              type="url" 
              id="audiobook-link"
              name="link"
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
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              Upload Audiobook File (max 10MB)
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2.5 bg-[#374151] border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 transition"
            />
            {selectedFile && (
              <div className="mt-2 text-gray-500 text-sm">
                Selected file: {selectedFile.name}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="story-part" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              Which part of the story for the video? *
            </label>
            <textarea 
              id="story-part"
              name="message"
              rows={3}
              required
              placeholder="e.g., Chapter 5, when the hero finds the sword..."
              className="w-full px-4 py-2.5 bg-[#374151] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"
            ></textarea>
          </div>
          
          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#17d5ff] hover:bg-[#15bde6] text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#17d5ff]/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
            
            <button 
              type="button"
              onClick={handleDonateClick}
              className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              Please support us with a donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;