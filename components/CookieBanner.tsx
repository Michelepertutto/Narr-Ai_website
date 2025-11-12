import React, { useState, useEffect } from 'react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
    // DEBUG: To reset cookie consent and see the banner again, run in console:
    // localStorage.removeItem('cookieConsent'); location.reload();
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10002] flex items-end justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 animate-slideUp">
        {!showPreferences ? (
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-[#17d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cookie e Privacy</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza, analizzare il traffico e personalizzare i contenuti. 
                  Puoi scegliere quali cookie accettare.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-2.5 bg-[#17d4ff] hover:bg-[#15bde6] text-black font-semibold rounded-xl transition-colors"
                  >
                    Accetta tutti
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors"
                  >
                    Rifiuta tutti
                  </button>
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="px-6 py-2.5 border-2 border-gray-300 hover:border-[#17d4ff] text-gray-800 font-semibold rounded-xl transition-colors"
                  >
                    Personalizza
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Leggi la nostra{' '}
                  <a href="/privacy-policy.html" className="text-[#17d4ff] hover:underline">
                    Privacy Policy
                  </a>
                  {' '}per maggiori informazioni.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Preferenze Cookie</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Chiudi preferenze cookie"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Cookie Necessari</h4>
                  <p className="text-sm text-gray-600">
                    Essenziali per il funzionamento del sito. Non possono essere disabilitati.
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-6 bg-[#17d4ff] rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Cookie Analitici</h4>
                  <p className="text-sm text-gray-600">
                    Ci aiutano a capire come i visitatori interagiscono con il sito.
                  </p>
                </div>
                <button
                  onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                  className="ml-4"
                  aria-label="Toggle cookie analitici"
                >
                  <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    preferences.analytics ? 'bg-[#17d4ff] justify-end' : 'bg-gray-300 justify-start'
                  } px-1`}>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </button>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Cookie Marketing</h4>
                  <p className="text-sm text-gray-600">
                    Utilizzati per mostrare contenuti personalizzati e pubblicità rilevante.
                  </p>
                </div>
                <button
                  onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                  className="ml-4"
                  aria-label="Toggle cookie marketing"
                >
                  <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    preferences.marketing ? 'bg-[#17d4ff] justify-end' : 'bg-gray-300 justify-start'
                  } px-1`}>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-6 py-2.5 bg-[#17d4ff] hover:bg-[#15bde6] text-black font-semibold rounded-xl transition-colors"
              >
                Salva preferenze
              </button>
              <button
                onClick={() => setShowPreferences(false)}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;