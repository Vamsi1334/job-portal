import type {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  WORK_MODES,
} from '@/constants';

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type WorkMode = (typeof WORK_MODES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  description: string;
  skills: string[];
  postedAt: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  headline: string;
  location: string;
  experienceLevel: ExperienceLevel;
  skills: string[];
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string;
}

/**
 * Generic paginated envelope returned by list endpoints.
 */
export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type Role = 'candidate' | 'employer' | 'admin';
export type EmployeeStatus = 'active' | 'suspended' | 'pending';

export interface ProfileExperience {
  title?: string;
  company?: string;
  start?: string;
  end?: string;
  description?: string;
}

export interface ProfileEducation {
  school?: string;
  degree?: string;
  start?: string;
  end?: string;
}

export interface ProfileProject {
  name?: string;
  link?: string;
  description?: string;
}

export interface ProfileCertification {
  name?: string;
  issuer?: string;
  year?: string;
}

export interface ProfileLanguage {
  name?: string;
  proficiency?: string;
}

export interface ProfileSocial {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

/**
 * Authenticated user as returned by the backend (the Employee model's toJSON).
 */
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  status: EmployeeStatus;
  isEmailVerified: boolean;
  headline?: string;
  location?: string;
  avatarUrl?: string;
  about?: string;
  dateOfBirth?: string;
  gender?: string;
  currentCompany?: string;
  noticePeriod?: string;
  expectedSalary?: string;
  preferredLocation?: string;
  social?: ProfileSocial;
  skills?: string[];
  experience?: ProfileExperience[];
  education?: ProfileEducation[];
  projects?: ProfileProject[];
  certifications?: ProfileCertification[];
  languages?: ProfileLanguage[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type UpdateProfilePayload = Partial<
  Pick<
    AuthUser,
    | 'firstName'
    | 'lastName'
    | 'phone'
    | 'headline'
    | 'location'
    | 'avatarUrl'
    | 'about'
    | 'dateOfBirth'
    | 'gender'
    | 'currentCompany'
    | 'noticePeriod'
    | 'expectedSalary'
    | 'preferredLocation'
    | 'social'
    | 'skills'
    | 'experience'
    | 'education'
    | 'projects'
    | 'certifications'
    | 'languages'
  >
>;
