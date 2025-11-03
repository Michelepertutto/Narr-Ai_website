
import React, { useEffect } from 'react';

interface SplashScreenProps {
  onAnimationEnd: () => void;
}

const SplashScreen = ({ onAnimationEnd }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 2000); // Duration matches the fade-out animation

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const text = "Narr-Ai";
  const letters = text.split('');

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[200]" style={{ animation: 'fadeOut 2s forwards' }}>
      <style>{`
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100px);
            filter: blur(8px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            filter: blur(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          0% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }

        .splash-letter {
          display: inline-block;
          font-size: 5rem;
          font-weight: 800;
          color: black;
          opacity: 0;
          animation: slideInFromLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        @media (min-width: 640px) {
            .splash-letter {
                font-size: 6rem;
            }
        }
      `}</style>
      <h1 className="text-black" aria-label="Narr-Ai">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="splash-letter"
            style={{ animationDelay: `${(letters.length - 1 - index) * 0.1}s` }}
            aria-hidden="true"
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default SplashScreen;