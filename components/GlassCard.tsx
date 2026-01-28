
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title, icon }) => {
  return (
    <div className={`glass-card p-6 rounded-2xl flex flex-col h-full ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="text-indigo-300">{icon}</div>}
          {title && <h3 className="text-xl font-semibold text-white tracking-tight">{title}</h3>}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
