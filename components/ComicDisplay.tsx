
import React from 'react';

interface ComicDisplayProps {
  characterCard: string | null;
  panelImages: string[];
}

const ComicDisplay: React.FC<ComicDisplayProps> = ({ characterCard, panelImages }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-12 space-y-12">
      {characterCard && (
        <section>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">Character Reference Sheet</h2>
          <div className="flex justify-center">
            <img 
              src={`data:image/png;base64,${characterCard}`} 
              alt="Character Reference" 
              className="rounded-lg shadow-2xl border-2 border-purple-500/50 max-w-sm w-full"
            />
          </div>
        </section>
      )}

      {panelImages.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">Your Comic Strip</h2>
          <div className={`grid grid-cols-1 ${panelImages.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
            {panelImages.map((img, index) => (
              <div key={index} className="relative aspect-square">
                <span className="absolute top-2 left-2 z-10 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded">
                  Panel {index + 1}
                </span>
                <img 
                  src={`data:image/png;base64,${img}`} 
                  alt={`Comic panel ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-gray-700"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ComicDisplay;
