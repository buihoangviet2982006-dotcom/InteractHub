import { http } from './http';

export interface TrendingHashtag {
  id: number;
  name: string;
  postCount: number;
}

export const hashtagsApi = {
  getTrending: async (limit: number = 10): Promise<TrendingHashtag[]> => {
    const response = await http.get<TrendingHashtag[]>('/hashtags/trending', {
      params: { limit }
    });
    return response.data;
  }
};
