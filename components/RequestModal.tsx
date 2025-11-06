import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const RequestModal = ({ isOpen, onClose, email = '' }: RequestModalProps) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  if (!isOpen) {
    return null;
  }

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/narrai', '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xqagrgnr', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          onClose();
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
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
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hidden email field */}
          <input type="hidden" name="email" value={email} />
          
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
              className="w-full px-4 py-2.5 bg-[#374151] border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 transition"
            />
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
              disabled={status === 'submitting'}
              className="w-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Sending...' : 'Submit Request'}
            </button>
            
            {status === 'success' && (
              <div className="p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-center text-sm">
                ✅ Request sent successfully! We'll contact you soon.
              </div>
            )}
            
            {status === 'error' && (
              <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-center text-sm">
                ❌ Error sending request. Please try again.
              </div>
            )}
            
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