import { useState } from 'react';
import { useStories } from '../../contexts/StoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { StoryItem } from './StoryItem';
import { StoryModal } from './StoryModal';
import { CreateStoryModal } from './CreateStoryModal';

export function StoryBar() {
  const { stories, loading } = useStories();
  const { user } = useAuth();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading && stories.length === 0) {
    return (
      <div className="flex space-x-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="min-w-[120px] h-[200px] bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full mb-6">
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Create Story Button */}
        <StoryItem 
          isCreate 
          onClick={() => setIsCreateModalOpen(true)} 
          avatarData={user?.avatarData} 
        />

        {/* Stories List */}
        {stories.map((story, index) => (
          <StoryItem 
            key={story.id} 
            story={story} 
            onClick={() => setSelectedStoryIndex(index)} 
          />
        ))}
      </div>

      {/* Modals */}
      {selectedStoryIndex !== null && (
        <StoryModal 
          stories={stories} 
          initialIndex={selectedStoryIndex} 
          onClose={() => setSelectedStoryIndex(null)} 
        />
      )}

      {isCreateModalOpen && (
        <CreateStoryModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
