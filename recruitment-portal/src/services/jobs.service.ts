import { apiClient } from '@/lib/axios';
import type { Job, Paginated } from '@/types';
import type { JobFormValues } from '@/schemas';

export interface JobListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  workMode?: string;
}

/**
 * All job-related network calls live here. Components and hooks never call
 * the API client directly, which keeps endpoints in one place and easy to mock.
 */
export const jobsService = {
  async list(params: JobListParams = {}): Promise<Paginated<Job>> {
    const { data } = await apiClient.get<Paginated<Job>>('/jobs', { params });
    return data;
  },

  async getById(id: string): Promise<Job> {
    const { data } = await apiClient.get<Job>(`/jobs/${id}`);
    return data;
  },

  async create(payload: JobFormValues): Promise<Job> {
    const { data } = await apiClient.post<Job>('/jobs', payload);
    return data;
  },

  async update(id: string, payload: Partial<JobFormValues>): Promise<Job> {
    const { data } = await apiClient.patch<Job>(`/jobs/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },
};
