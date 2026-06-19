import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import { jobsService, type JobListParams } from '@/services/jobs.service';
import type { JobFormValues } from '@/schemas';

/**
 * Fetch a paginated list of jobs.
 */
export function useJobs(params: JobListParams = {}) {
  return useQuery({
    queryKey: queryKeys.jobs.list(params as Record<string, unknown>),
    queryFn: () => jobsService.list(params),
  });
}

/**
 * Fetch a single job by id. Disabled until an id is provided.
 */
export function useJob(id: string) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => jobsService.getById(id),
    enabled: Boolean(id),
  });
}

/**
 * Create a job and refresh any cached job lists.
 */
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JobFormValues) => jobsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
    },
  });
}
