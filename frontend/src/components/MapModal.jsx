import React from 'react';

export default function MapModal({ pickup, dropoff, onClose }) {
  // We use a simple Google Map Embed iframe
  // It requires an API key in VITE_GOOGLE_MAPS_API_KEY
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // If no pickup/dropoff or API key, show an error or simple fallback
  
  const mapSrc = apiKey && pickup && dropoff 
    ? `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}`
    : '';

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-slate-900 border border-slate-700 rounded-xl relative shadow-2xl animate-in zoom-in-95 duration-200 m-4">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Route Directions</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 bg-slate-800 w-full rounded-b-xl overflow-hidden relative">
          {mapSrc ? (
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapSrc}
            ></iframe>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400 flex-col gap-4">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <p>Map unavailable. Missing Google Maps API Key or Locations.</p>
                <div className="text-sm">Pickup: {pickup || 'Unknown'} | Dropoff: {dropoff || 'Unknown'}</div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
