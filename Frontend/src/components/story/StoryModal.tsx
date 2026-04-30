import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Story } from '../../types';
import { useState, useEffect } from 'react';

interface StoryModalProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export function StoryModal({ stories, initialIndex, onClose }: StoryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const story = stories[currentIndex];
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Auto advance (optional, but nice)
  useEffect(() => {
    const timer = setTimeout(handleNext, 10000); // 10 seconds per story
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const ensureBase64Prefix = (data?: string) => {
    if (!data) return null;
    return data.startsWith('data:') ? data : `data:image/jpeg;base64,${data}`;
  };

  if (!story) return null;

  const bgImage = ensureBase64Prefix(story.mediaData || story.userAvatarData) || defaultAvatar;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black animate-in fade-in duration-300">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[500px] h-full sm:h-[95vh] flex flex-col bg-gray-900 sm:rounded-2xl overflow-hidden shadow-2xl">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 p-2 flex space-x-1 z-20">
          {stories.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-[10000ms] linear ${idx < currentIndex ? 'w-full' : idx === currentIndex ? 'w-full' : 'w-0'}`}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 p-4 flex items-center justify-between z-20">
          <div className="flex items-center space-x-3">
            <img 
              src={ensureBase64Prefix(story.userAvatarData) || defaultAvatar} 
              alt={story.userFullName} 
              className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover" 
            />
            <div>
              <div className="text-white font-bold text-shadow-sm">{story.userFullName}</div>
              <div className="text-white/70 text-xs">{new Date(story.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Media */}
        <div className="flex-1 flex items-center justify-center relative bg-black/40 group">
          {story.mediaData ? (
            <img 
              src={ensureBase64Prefix(story.mediaData) || ''} 
              alt="Story" 
              className="max-w-full max-h-full object-contain" 
            />
          ) : (
            <div className="text-white text-2xl font-bold px-8 text-center italic">
              {story.content}
            </div>
          )}

          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full transition-all opacity-0 group-hover:opacity-100 ${currentIndex === 0 ? 'hidden' : ''}`}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Content Overlay/Footer */}
        {story.mediaData && story.content && (
          <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
             <p className="text-white text-lg text-center font-medium drop-shadow-md">
               {story.content}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
