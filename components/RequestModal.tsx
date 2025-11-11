import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';

declare global {
  interface Window {
    grecaptcha: any;
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
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !recaptchaLoaded) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=6LfKsQgsAAAAAD4oABkCCGhU-_G8JCo385Pg_bQ9';
      script.async = true;
      script.defer = true;
      script.onload = () => setRecaptchaLoaded(true);
      document.head.appendChild(script);
    }
  }, [isOpen, recaptchaLoaded]);

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
        alert(`Too many submissions. Please try again in ${timeUntilReset} minutes.`);
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
    
    if (!checkRateLimit()) {
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const link = formData.get('link') as string;
    const message = formData.get('message') as string;

    if (link && link.length > 500) {
      alert('Link is too long');
      return;
    }

    if (message && message.length > 2000) {
      alert('Message is too long');
      return;
    }

    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsSubmitting(true);

    try {
      if (window.grecaptcha && recaptchaLoaded) {
        await window.grecaptcha.ready(async () => {
          const token = await window.grecaptcha.execute('6LfKsQgsAAAAAD4oABkCCGhU-_G8JCo385Pg_bQ9', { action: 'submit' });
          const hiddenInput = document.createElement('input');
          hiddenInput.type = 'hidden';
          hiddenInput.name = 'g-recaptcha-response';
          hiddenInput.value = token;
          form.appendChild(hiddenInput);
          form.submit();
        });
      } else {
        form.submit();
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setSelectedFile(null);
        alert('Request submitted successfully!');
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      alert('Error submitting request. Please try again.');
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
          <input type="hidden" name="_subject" value={isCollabForm ? "New Collaboration Request from Narr-AI" : "New Audiobook Request from Narr-AI"} />
          <input type="hidden" name="_captcha" value="true" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_autoresponse" value={isCollabForm ? "Thank you! We received your collaboration request and will contact you soon." : "Thank you! We received your request and will process it within 1-3 days."} />
          {email && <input type="hidden" name="user_email" value={email} />}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              Name *
            </label>
            <input 
              type="text" 
              id="name"
              name="name"
              required
              maxLength={100}
              placeholder="Your name" 
              className="w-full px-4 py-2.5 bg-[#374151] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              Email *
            </label>
            <input 
              type="email" 
              id="email"
              name="email"
              required
              maxLength={100}
              placeholder="your.email@example.com" 
              className="w-full px-4 py-2.5 bg-[#374151] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
          </div>
          
          {!isCollabForm && (
            <>
              <div>
                <label htmlFor="audiobook-link" className="block text-sm font-medium text-gray-400 mb-2 text-left">
                  Audiobook Link
                </label>
                <input 
                  type="url" 
                  id="audiobook-link"
                  name="link"
                  maxLength={500}
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
            </>
          )}
          
          <div>
            <label htmlFor="story-part" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              {isCollabForm ? 'Tell us about your collaboration idea *' : 'Which part of the story for the video? *'}
            </label>
            <textarea 
              id="story-part"
              name="message"
              rows={3}
              required
              maxLength={2000}
              placeholder={isCollabForm ? 'Describe your collaboration proposal...' : 'e.g., Chapter 5, when the hero finds the sword...'}
              className="w-full px-4 py-2.5 bg-[#374151] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"
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