import { http } from './http';
import type { PostReportCreate, PostReportResponse } from '../types';

export const reportApi = {
  createReport: async (data: PostReportCreate): Promise<PostReportResponse> => {
    const response = await http.post<PostReportResponse>('/PostReports', data);
    return response.data;
  },

  getReports: async (limit: number = 10, cursorId?: number): Promise<any> => {
    const response = await http.get('/PostReports', {
      params: { limit, cursorId }
    });
    return response.data;
  },

  deleteReport: async (id: number): Promise<void> => {
    await http.delete(`/PostReports/${id}`);
  }
};
