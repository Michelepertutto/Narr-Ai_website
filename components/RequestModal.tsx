import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';

declare global {
  interface Window {
  }
}

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  isCollabForm?: boolean;
}

const RATE_LIMIT_KEY = 'narr_ai_form_submissions';
const MAX_SUBMISSIONS = 3;
const RATE_LIMIT_WINDOW = 3600000;

const RequestModal = ({ isOpen, onClose, email = '', isCollabForm = false }: RequestModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
  }, []);

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/narrai', '_blank', 'noopener,noreferrer');
  };

  const checkRateLimit = (): boolean => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      if (!stored) return true;
      
      const submissions: number[] = JSON.parse(stored);
      const now = Date.now();
      const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW);
      
      if (recentSubmissions.length >= MAX_SUBMISSIONS) {
        const oldestSubmission = Math.min(...recentSubmissions);
        const timeUntilReset = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestSubmission)) / 60000);
        setSubmitError(`Too many submissions. Please try again in ${timeUntilReset} minutes.`);
        return false;
      }
      
      recentSubmissions.push(now);
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions));
      return true;
    } catch (e) {
      return true;
    }
  };

  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>"']/g, '')
      .trim()
      .slice(0, 1000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setSubmitSuccess(false);
    setSubmitError('');
    
    if (!checkRateLimit()) {
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const link = formData.get('link') as string;
    const message = formData.get('message') as string;

    if (link && link.length > 500) {
      setSubmitError('Link is too long');
      return;
    }

    if (message && message.length > 2000) {
      setSubmitError('Message is too long');
      return;
    }

    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setSubmitError('File size must be less than 10MB');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xqagrgnr', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setIsSubmitting(false);
        setSelectedFile(null);
        form.reset();
        
        setTimeout(() => {
          setSubmitSuccess(false);
          onClose();
        }, 3000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      setSubmitError('Error submitting request. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] p-4 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        
        <form 
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Formspree Configuration */}
          <input type="hidden" name="_subject" value={isCollabForm ? "New Collaboration Request from Narr-AI" : "New Audiobook Request from Narr-AI"} />
          <input type="hidden" name="form_type" value={isCollabForm ? "collaboration" : "audiobook_request"} />
          {email && <input type="hidden" name="user_email" value={email} />}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Name *
            </label>
            <input 
              type="text" 
              id="name"
              name="name"
              required
              maxLength={100}
              placeholder="Your name" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#17d4ff] focus:border-[#17d4ff] transition"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Email *
            </label>
            <input 
              type="email" 
              id="email"
              name="email"
              required
              maxLength={100}
              placeholder="your.email@example.com" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#17d4ff] focus:border-[#17d4ff] transition"
            />
          </div>
          
          {!isCollabForm && (
            <>
              <div>
                <label htmlFor="audiobook-link" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Audiobook Link
                </label>
                <input 
                  type="url" 
                  id="audiobook-link"
                  name="link"
                  maxLength={500}
                  placeholder="https://example.com/audiobook" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#17d4ff] focus:border-[#17d4ff] transition"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>For large audiobook files:</strong>
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  Upload your file to <a href="https://wetransfer.com" target="_blank" rel="noopener noreferrer" className="text-[#17d4ff] hover:underline">WeTransfer</a>, <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="text-[#17d4ff] hover:underline">Google Drive</a>, or <a href="https://www.dropbox.com" target="_blank" rel="noopener noreferrer" className="text-[#17d4ff] hover:underline">Dropbox</a>, then paste the sharing link in the "Audiobook Link" field above.
                </p>
              </div>
            </>
          )}
          
          <div>
            <label htmlFor="story-part" className="block text-sm font-medium text-gray-700 mb-2 text-left">
              {isCollabForm ? 'Tell us about your collaboration idea *' : 'Which part of the story for the video? *'}
            </label>
            <textarea 
              id="story-part"
              name="message"
              rows={3}
              required
              maxLength={2000}
              placeholder={isCollabForm ? 'Describe your collaboration proposal...' : 'e.g., Chapter 5, when the hero finds the sword...'}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#17d4ff] focus:border-[#17d4ff] transition resize-none"
            ></textarea>
          </div>
          
          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#17d5ff] hover:bg-[#15bde6] text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#17d5ff]/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : (isCollabForm ? 'Send Collaboration Request' : 'Submit Request')}
            </button>
            
            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-700 font-medium">✓ Request submitted successfully!</p>
                <p className="text-green-600 text-sm mt-1">We'll get back to you soon.</p>
              </div>
            )}
            
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700 font-medium">{submitError}</p>
              </div>
            )}
            
            <button 
              type="button"
              onClick={handleDonateClick}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
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