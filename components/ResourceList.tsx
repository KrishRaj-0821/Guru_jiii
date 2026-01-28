
import React from 'react';
import { Resource } from '../types';
import GlassCard from './GlassCard';
import { Library, Book, Video, Globe, FileText, ExternalLink } from 'lucide-react';

interface ResourceListProps {
  resources: Resource[];
}

const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'book': return <Book className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'website': return <Globe className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      default: return <Library className="w-4 h-4" />;
    }
  };

  return (
    <GlassCard title="Further Resources" icon={<Library className="w-6 h-6" />}>
      <div className="space-y-3">
        {resources.map((res, idx) => (
          <a 
            key={idx} 
            href={res.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-indigo-300 font-medium">
                {getIcon(res.type)}
                <span className="text-xs uppercase tracking-wider">{res.type}</span>
              </div>
              <ExternalLink className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-white font-semibold group-hover:text-indigo-200 transition-colors line-clamp-1">{res.title}</h4>
            <p className="text-indigo-200/70 text-xs mt-1 line-clamp-2 leading-tight">{res.description}</p>
          </a>
        ))}
      </div>
    </GlassCard>
  );
};

export default ResourceList;
