import React from 'react';
import { Link } from 'lucide-react';

interface LeadershipCardProps {
  name: string;
  designation: string;
  bio: string;
  imageUrl?: string;
  linkedinUrl?: string;
}

export const LeadershipCard: React.FC<LeadershipCardProps> = ({ 
  name, 
  designation, 
  bio, 
  imageUrl,
  linkedinUrl 
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
      <div className="aspect-square bg-gray-200 relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 group-hover:bg-gray-200 transition-colors">
            <span>[Photo]</span>
          </div>
        )}
      </div>
      <div className="p-6 relative">
        <h3 className="text-xl font-bold text-text">{name}</h3>
        <p className="text-primary font-medium text-sm mb-4">{designation}</p>
        <p className="text-gray-600 text-sm line-clamp-4">{bio}</p>
        
        {linkedinUrl && (
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Link size={20} />
          </a>
        )}
      </div>
    </div>
  );
};
