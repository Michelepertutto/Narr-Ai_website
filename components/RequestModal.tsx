import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mufyetrgczbtfxlnjmnv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZnlldHJnY3pidGZ4bG5qbW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDg2NzMsImV4cCI6MjA3ODM4NDY3M30.msrxDqgRA16nr6pgmouTf4qP5ei7iXeoTP3TUvaoxKM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const RequestModal = ({ isOpen, onClose, email = '' }: RequestModalProps) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) {
    return null;
  }

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/narrai', '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setUploadProgress(0);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const link = formData.get('link') as string;
    const message = formData.get('message') as string;
    const file = formData.get('file') as File;

    try {
      let fileUrl = null;
      
      if (file && file.size > 0) {
        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10MB');
          setStatus('error');
          return;
        }
        
        setUploadProgress(30);
        const fileName = `${Date.now()}_${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('audiobook-requests')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          setStatus('error');
          return;
        }
        
        setUploadProgress(60);
        
        const { data: urlData } = supabase.storage
          .from('audiobook-requests')
          .getPublicUrl(fileName);
        
        fileUrl = urlData.publicUrl;
      }
      
      setUploadProgress(80);
      
      const { error: dbError } = await supabase
        .from('requests')
        .insert({
          audiobook_link: link || null,
          file_url: fileUrl,
          story_part: message,
          email: email || null,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Database error:', dbError);
        setStatus('error');
        return;
      }
      
      setUploadProgress(100);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setUploadProgress(0);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
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
            {status === 'submitting' && uploadProgress > 0 && (
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-[#17d5ff] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            <button 
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-[#17d5ff] hover:bg-[#15bde6] text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#17d5ff]/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? `Uploading... ${uploadProgress}%` : 'Submit Request'}
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