import { z } from 'zod';

import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  WORK_MODES,
} from '@/constants';

export const jobSchema = z
  .object({
    title: z.string().min(2, 'Title is too short').max(120),
    department: z.string().min(2, 'Department is required'),
    location: z.string().min(2, 'Location is required'),
    employmentType: z.enum(EMPLOYMENT_TYPES),
    workMode: z.enum(WORK_MODES),
    experienceLevel: z.enum(EXPERIENCE_LEVELS),
    salaryMin: z.coerce.number().int().nonnegative(),
    salaryMax: z.coerce.number().int().nonnegative(),
    description: z.string().min(20, 'Add a short description (at least 20 characters)'),
    skills: z.array(z.string().min(1)).min(1, 'Add at least one skill'),
  })
  .refine((data) => data.salaryMax >= data.salaryMin, {
    message: 'Maximum salary must be greater than or equal to minimum',
    path: ['salaryMax'],
  });

export type JobFormValues = z.infer<typeof jobSchema>;

export const applicationSchema = z.object({
  jobId: z.string().min(1, 'Select a job'),
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  coverLetter: z.string().max(2000).optional(),
  status: z.enum(APPLICATION_STATUSES).default('Applied'),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
