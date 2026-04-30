import { http } from './http';
import type { Story } from '../types';

export const storiesApi = {
  getActiveStories: async (): Promise<Story[]> => {
    const response = await http.get<Story[]>('/stories');
    return response.data;
  },
  
  createStory: async (mediaData?: string, content?: string): Promise<Story> => {
    // mediaData is expected to be a base64 string (including data:image/...)
    // The backend expects byte[] which ASP.NET handles from base64 strings in JSON.
    // However, we should strip the prefix if it exists.
    const rawData = mediaData?.split(',')[1] || mediaData;
    
    const response = await http.post<Story>('/stories', {
      mediaData: rawData,
      content
    });
    return response.data;
  }
};
