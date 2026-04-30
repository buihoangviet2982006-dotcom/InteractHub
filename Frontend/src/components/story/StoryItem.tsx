import { Plus } from 'lucide-react';
import type { Story } from '../../types';

interface StoryItemProps {
  story?: Story;
  isCreate?: boolean;
  onClick: () => void;
  avatarData?: string;
  fullName?: string;
}

export function StoryItem({ story, isCreate, onClick, avatarData, fullName }: StoryItemProps) {
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  const ensureBase64Prefix = (data?: string) => {
    if (!data) return null;
    return data.startsWith('data:') ? data : `data:image/jpeg;base64,${data}`;
  };

  if (isCreate) {
    return (
      <div 
        onClick={onClick}
        className="relative min-w-[120px] h-[200px] rounded-xl overflow-hidden shadow-md cursor-pointer group bg-white border border-gray-200"
      >
        <div className="h-[140px] overflow-hidden">
          <img 
            src={ensureBase64Prefix(avatarData) || defaultAvatar} 
            alt="My avatar" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-white flex flex-col items-center justify-center">
          <div className="absolute -top-4 bg-blue-600 p-1.5 rounded-full border-4 border-white text-white">
            <Plus className="w-5 h-5" />
          </div>
          <span className="mt-2 text-xs font-bold text-gray-900">Tạo tin</span>
        </div>
      </div>
    );
  }

  if (!story) return null;

  const displayImage = story.mediaData 
    ? ensureBase64Prefix(story.mediaData)
    : (ensureBase64Prefix(story.userAvatarData) || defaultAvatar);

  return (
    <div 
      onClick={onClick}
      className="relative min-w-[120px] h-[200px] rounded-xl overflow-hidden shadow-md cursor-pointer group"
    >
      {/* Background Image */}
      <img 
        src={displayImage || defaultAvatar} 
        alt={story.userFullName} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

      {/* User Avatar */}
      <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-4 border-blue-600 overflow-hidden bg-white z-10 shadow-md">
        <img src={ensureBase64Prefix(story.userAvatarData) || defaultAvatar} alt={story.userFullName} className="w-full h-full object-cover" />
      </div>

      {/* User Name */}
      <div className="absolute bottom-3 left-3 right-3 z-10">
        <p className="text-white text-xs font-bold truncate drop-shadow-lg">
          {story.userFullName}
        </p>
      </div>

      {/* Text Preview (if no media) */}
      {!story.mediaData && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <p className="text-white text-[10px] italic font-medium text-center line-clamp-4 leading-tight">
            {story.content}
          </p>
        </div>
      )}
    </div>
  );
}
