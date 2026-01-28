
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface VisualAnalogyProps {
  analogy: string;
  imageUrl?: string;
}

const VisualAnalogy: React.FC<VisualAnalogyProps> = ({ analogy, imageUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <GlassCard title="Visual Analogy" icon={<ImageIcon className="w-6 h-6" />}>
      <div className="space-y-4">
        <p className="text-indigo-50 leading-relaxed italic border-l-4 border-indigo-400 pl-4">
          "{analogy}"
        </p>
        
        {imageUrl && (
          <div className="relative rounded-xl overflow-hidden aspect-video bg-indigo-900/50 flex items-center justify-center border border-white/10 shadow-inner">
            {loading && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-indigo-200">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-medium">Drawing analogy...</span>
              </div>
            )}
            
            {error ? (
              <div className="p-4 text-center text-indigo-300 text-sm">
                Visual representation failed to load.
              </div>
            ) : (
              <img 
                src={imageUrl} 
                alt="Visual Analogy" 
                className={`w-full h-full object-cover transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
              />
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default VisualAnalogy;
