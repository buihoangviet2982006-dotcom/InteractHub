import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Story } from '../types';
import { storiesApi } from '../services/storiesApi';

interface StoryContextType {
  stories: Story[];
  loading: boolean;
  fetchStories: () => Promise<void>;
  addStory: (mediaData?: string, content?: string) => Promise<void>;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await storiesApi.getActiveStories();
      setStories(data);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addStory = async (mediaData?: string, content?: string) => {
    try {
      const newStory = await storiesApi.createStory(mediaData, content);
      setStories(prev => [newStory, ...prev]);
    } catch (error) {
      console.error('Failed to create story:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <StoryContext.Provider value={{ stories, loading, fetchStories, addStory }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStories() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a StoryProvider');
  }
  return context;
}
