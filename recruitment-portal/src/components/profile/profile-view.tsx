'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, LogOut, Pencil, Plus, Trash2, X } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';
import { useLogout, useUpdateProfile } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { FormStatus } from '@/components/common/form-status';
import type {
  AuthUser,
  ProfileCertification,
  ProfileEducation,
  ProfileExperience,
  ProfileLanguage,
  ProfileProject,
  UpdateProfilePayload,
} from '@/types';

const inputClass =
  'mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-foreground';
const labelClass = 'text-sm font-medium';
const cardClass = 'rounded-2xl border border-border bg-card p-5 sm:p-6';

/** A repeatable row counts as filled if any of its fields has a non-empty value. */
function rowHasContent(row: unknown): boolean {
  if (!row || typeof row !== 'object') return false;
  return Object.values(row as Record<string, unknown>).some(
    (v) => typeof v === 'string' && v.trim() !== '',
  );
}

function cleanRows<T>(rows: T[]): T[] {
  return (rows ?? []).filter(rowHasContent);
}

function splitName(fullName: string, fallback: { firstName: string; lastName: string }) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return { firstName: parts[0], lastName: fallback.lastName };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

const emptyForm = {
  fullName: '',
  headline: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  about: '',
  currentCompany: '',
  noticePeriod: '1 month',
  expectedSalary: '',
  preferredLocation: '',
  linkedin: '',
  github: '',
  portfolio: '',
  twitter: '',
};

type FormState = typeof emptyForm;

/** True when the user has filled in essentially nothing yet. */
function isProfileEmpty(u: AuthUser | null) {
  if (!u) return true;
  return (
    !u.headline &&
    !u.about &&
    !u.phone &&
    !u.currentCompany &&
    !(u.skills && u.skills.length) &&
    !(u.experience && u.experience.length) &&
    !(u.education && u.education.length) &&
    !(u.projects && u.projects.length) &&
    !(u.certifications && u.certifications.length) &&
    !(u.languages && u.languages.length)
  );
}

export function ProfileView() {
  const { user } = useAuth();
  const update = useUpdateProfile();
  const logout = useLogout();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<{ variant: 'success' | 'error'; message: string } | null>(
    null,
  );

  const [form, setForm] = useState<FormState>(emptyForm);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [experience, setExperience] = useState<ProfileExperience[]>([]);
  const [education, setEducation] = useState<ProfileEducation[]>([]);
  const [projects, setProjects] = useState<ProfileProject[]>([]);
  const [certifications, setCertifications] = useState<ProfileCertification[]>([]);
  const [languages, setLanguages] = useState<ProfileLanguage[]>([]);

  const loadFromUser = (u: AuthUser) => {
    setForm({
      fullName: u.fullName ?? '',
      headline: u.headline ?? '',
      phone: u.phone ?? '',
      dateOfBirth: u.dateOfBirth ?? '',
      gender: u.gender ?? '',
      about: u.about ?? '',
      currentCompany: u.currentCompany ?? '',
      noticePeriod: u.noticePeriod ?? '1 month',
      expectedSalary: u.expectedSalary ?? '',
      preferredLocation: u.preferredLocation ?? '',
      linkedin: u.social?.linkedin ?? '',
      github: u.social?.github ?? '',
      portfolio: u.social?.portfolio ?? '',
      twitter: u.social?.twitter ?? '',
    });
    // Drop any null/blank rows that may exist in older saved data so the edit
    // form never maps over a null entry.
    setSkills((u.skills ?? []).filter((s) => s && s.trim() !== ''));
    setExperience(cleanRows(u.experience ?? []));
    setEducation(cleanRows(u.education ?? []));
    setProjects(cleanRows(u.projects ?? []));
    setCertifications(cleanRows(u.certifications ?? []));
    setLanguages(cleanRows(u.languages ?? []));
  };

  // First load: seed the form and start in edit mode only if the profile is empty.
  const initialized = useRef(false);
  useEffect(() => {
    if (!user || initialized.current) return;
    initialized.current = true;
    loadFromUser(user);
    setEditing(isProfileEmpty(user));
  }, [user]);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !skills.includes(value)) setSkills((s) => [...s, value]);
    setSkillInput('');
  };

  const onLogout = async () => {
    await logout.mutateAsync();
    router.replace('/login');
  };

  const startEdit = () => {
    if (user) loadFromUser(user);
    setStatus(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    if (user) loadFromUser(user);
    setStatus(null);
    setEditing(false);
  };

  const onSave = async () => {
    setStatus(null);
    const { firstName, lastName } = splitName(form.fullName, {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    });

    const payload: UpdateProfilePayload = {
      firstName,
      lastName,
      phone: form.phone,
      headline: form.headline,
      about: form.about,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      currentCompany: form.currentCompany,
      noticePeriod: form.noticePeriod,
      expectedSalary: form.expectedSalary,
      preferredLocation: form.preferredLocation,
      social: {
        linkedin: form.linkedin,
        github: form.github,
        portfolio: form.portfolio,
        twitter: form.twitter,
      },
      skills: skills.filter((s) => s.trim() !== ''),
      experience: cleanRows(experience),
      education: cleanRows(education),
      projects: cleanRows(projects),
      certifications: cleanRows(certifications),
      languages: cleanRows(languages),
    };

    try {
      await update.mutateAsync(payload);
      // Saved: drop back to the read-only view ("reset" the editable fields).
      setEditing(false);
      setStatus({ variant: 'success', message: 'Profile saved.' });
    } catch {
      setStatus({ variant: 'error', message: 'Could not save your profile. Please try again.' });
    }
  };

  return (
    <ProtectedRoute>
      {/* Sticky action bar */}
      <div className="sticky top-16 z-20 border-b border-border bg-background/90 backdrop-blur">
        <Container className="flex h-14 items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onLogout} disabled={logout.isPending}>
              {logout.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="size-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">Sign out</span>
            </Button>
            {editing ? (
              <Button size="sm" onClick={onSave} disabled={update.isPending}>
                {update.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                Save changes
              </Button>
            ) : (
              <Button size="sm" onClick={startEdit}>
                <Pencil className="size-4" /> Edit profile
              </Button>
            )}
          </div>
        </Container>
      </div>

      <Container className="max-w-4xl space-y-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground font-display text-xl font-bold text-background">
            {initials || 'U'}
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              {editing ? 'Edit your profile' : user?.fullName || 'Your profile'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {editing
                ? 'Keep this up to date. A complete profile ranks higher in recruiter searches.'
                : user?.headline || 'Add a headline to stand out to recruiters.'}
            </p>
          </div>
        </div>

        {status ? <FormStatus variant={status.variant} message={status.message} /> : null}

        {editing ? (
          <EditForm
            form={form}
            set={set}
            email={user?.email ?? ''}
            skills={skills}
            setSkills={setSkills}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            addSkill={addSkill}
            experience={experience}
            setExperience={setExperience}
            education={education}
            setEducation={setEducation}
            projects={projects}
            setProjects={setProjects}
            certifications={certifications}
            setCertifications={setCertifications}
            languages={languages}
            setLanguages={setLanguages}
            onSave={onSave}
            onCancel={cancelEdit}
            saving={update.isPending}
          />
        ) : (
          <ProfileSummary user={user} onEdit={startEdit} />
        )}
      </Container>
    </ProtectedRoute>
  );
}

/* ------------------------------------------------------------------ */
/* Read-only summary                                                   */
/* ------------------------------------------------------------------ */

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={cardClass}>
      <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ProfileSummary({ user, onEdit }: { user: AuthUser | null; onEdit: () => void }) {
  if (!user) return null;

  const social = user.social ?? {};
  const socialLinks = [
    { label: 'LinkedIn', value: social.linkedin },
    { label: 'GitHub', value: social.github },
    { label: 'Portfolio', value: social.portfolio },
    { label: 'X / Twitter', value: social.twitter },
  ].filter((s) => s.value);

  const hasCareer =
    user.currentCompany || user.expectedSalary || user.preferredLocation || user.noticePeriod;

  // Defensive: older saves may contain blank or null rows.
  const skills = (user.skills ?? []).filter((s) => s && s.trim() !== '');
  const experience = cleanRows(user.experience ?? []);
  const education = cleanRows(user.education ?? []);
  const projects = cleanRows(user.projects ?? []);
  const certifications = cleanRows(user.certifications ?? []);
  const languages = cleanRows(user.languages ?? []);

  return (
    <div className="space-y-6">
      <SummaryCard title="Personal details">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Full name" value={user.fullName} />
          <Field label="Headline" value={user.headline} />
          <Field label="Email" value={user.email} />
          <Field label="Phone" value={user.phone} />
          <Field label="Date of birth" value={user.dateOfBirth} />
          <Field label="Gender" value={user.gender} />
        </div>
        {user.about ? <p className="mt-5 text-sm leading-relaxed">{user.about}</p> : null}
      </SummaryCard>

      {hasCareer ? (
        <SummaryCard title="Career details">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Current company" value={user.currentCompany} />
            <Field label="Notice period" value={user.noticePeriod} />
            <Field label="Expected salary" value={user.expectedSalary} />
            <Field label="Preferred location" value={user.preferredLocation} />
          </div>
        </SummaryCard>
      ) : null}

      {socialLinks.length ? (
        <SummaryCard title="Social links">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {socialLinks.map((s) => (
              <div key={s.label}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 break-words text-sm">{s.value}</p>
              </div>
            ))}
          </div>
        </SummaryCard>
      ) : null}

      {skills.length ? (
        <SummaryCard title="Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="rounded-full border border-border px-3 py-1 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </SummaryCard>
      ) : null}

      {experience.length ? (
        <SummaryCard title="Experience">
          <div className="space-y-4">
            {experience.map((x, i) => (
              <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <p className="text-sm font-semibold">{x.title || 'Role'}</p>
                <p className="text-sm text-muted-foreground">
                  {[x.company, [x.start, x.end].filter(Boolean).join(' – ')]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                {x.description ? <p className="mt-1 text-sm">{x.description}</p> : null}
              </div>
            ))}
          </div>
        </SummaryCard>
      ) : null}

      {education.length ? (
        <SummaryCard title="Education">
          <div className="space-y-4">
            {education.map((x, i) => (
              <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <p className="text-sm font-semibold">{x.school || 'School'}</p>
                <p className="text-sm text-muted-foreground">
                  {[x.degree, [x.start, x.end].filter(Boolean).join(' – ')]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </SummaryCard>
      ) : null}

      {projects.length ? (
        <SummaryCard title="Projects">
          <div className="space-y-4">
            {projects.map((x, i) => (
              <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <p className="text-sm font-semibold">{x.name || 'Project'}</p>
                {x.link ? <p className="text-sm text-muted-foreground">{x.link}</p> : null}
                {x.description ? <p className="mt-1 text-sm">{x.description}</p> : null}
              </div>
            ))}
          </div>
        </SummaryCard>
      ) : null}

      {certifications.length ? (
        <SummaryCard title="Certifications">
          <div className="space-y-3">
            {certifications.map((x, i) => (
              <p key={i} className="text-sm">
                <span className="font-semibold">{x.name || 'Certification'}</span>
                {x.issuer || x.year
                  ? ` — ${[x.issuer, x.year].filter(Boolean).join(', ')}`
                  : ''}
              </p>
            ))}
          </div>
        </SummaryCard>
      ) : null}

      {languages.length ? (
        <SummaryCard title="Languages">
          <div className="flex flex-wrap gap-2">
            {languages.map((x, i) => (
              <span key={i} className="rounded-full border border-border px-3 py-1 text-sm">
                {x.name}
                {x.proficiency ? <span className="text-muted-foreground"> · {x.proficiency}</span> : null}
              </span>
            ))}
          </div>
        </SummaryCard>
      ) : null}

      <div className="flex justify-end pb-6">
        <Button onClick={onEdit}>
          <Pencil className="size-4" /> Edit profile
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Edit form                                                           */
/* ------------------------------------------------------------------ */

interface EditFormProps {
  form: FormState;
  set: (
    key: keyof FormState,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  email: string;
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
  skillInput: string;
  setSkillInput: (v: string) => void;
  addSkill: () => void;
  experience: ProfileExperience[];
  setExperience: React.Dispatch<React.SetStateAction<ProfileExperience[]>>;
  education: ProfileEducation[];
  setEducation: React.Dispatch<React.SetStateAction<ProfileEducation[]>>;
  projects: ProfileProject[];
  setProjects: React.Dispatch<React.SetStateAction<ProfileProject[]>>;
  certifications: ProfileCertification[];
  setCertifications: React.Dispatch<React.SetStateAction<ProfileCertification[]>>;
  languages: ProfileLanguage[];
  setLanguages: React.Dispatch<React.SetStateAction<ProfileLanguage[]>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

function EditForm({
  form,
  set,
  email,
  skills,
  setSkills,
  skillInput,
  setSkillInput,
  addSkill,
  experience,
  setExperience,
  education,
  setEducation,
  projects,
  setProjects,
  certifications,
  setCertifications,
  languages,
  setLanguages,
  onSave,
  onCancel,
  saving,
}: EditFormProps) {
  return (
    <div className="space-y-6">
      {/* Personal details */}
      <section className={cardClass}>
        <h2 className="font-display text-lg font-bold tracking-tight">Personal details</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Full name</label>
            <input className={inputClass} value={form.fullName} onChange={set('fullName')} placeholder="Ada Lovelace" />
          </div>
          <div>
            <label className={labelClass}>Headline</label>
            <input className={inputClass} value={form.headline} onChange={set('headline')} placeholder="Senior Product Designer" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={`${inputClass} cursor-not-allowed opacity-70`} value={email} readOnly />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={form.phone} onChange={set('phone')} placeholder="+1 555 000 1234" />
          </div>
          <div>
            <label className={labelClass}>Date of birth</label>
            <input type="date" className={inputClass} value={form.dateOfBirth} onChange={set('dateOfBirth')} />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select className={inputClass} value={form.gender} onChange={set('gender')}>
              <option value="">Prefer not to say</option>
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>About</label>
            <textarea rows={3} className={inputClass} value={form.about} onChange={set('about')} placeholder="A short summary of who you are and what you do." />
          </div>
        </div>
      </section>

      {/* Career details */}
      <section className={cardClass}>
        <h2 className="font-display text-lg font-bold tracking-tight">Career details</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Helps us match you to the right roles.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Current company</label>
            <input className={inputClass} value={form.currentCompany} onChange={set('currentCompany')} placeholder="Monoline" />
          </div>
          <div>
            <label className={labelClass}>Notice period</label>
            <select className={inputClass} value={form.noticePeriod} onChange={set('noticePeriod')}>
              <option>Immediate</option>
              <option>15 days</option>
              <option>1 month</option>
              <option>2 months</option>
              <option>3 months</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Expected salary</label>
            <input className={inputClass} value={form.expectedSalary} onChange={set('expectedSalary')} placeholder="e.g. $120k" />
          </div>
          <div>
            <label className={labelClass}>Preferred location</label>
            <input className={inputClass} value={form.preferredLocation} onChange={set('preferredLocation')} placeholder="Remote, Berlin, London" />
          </div>
        </div>
      </section>

      {/* Social links */}
      <section className={cardClass}>
        <h2 className="font-display text-lg font-bold tracking-tight">Social links</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input className={inputClass} value={form.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/you" />
          </div>
          <div>
            <label className={labelClass}>GitHub</label>
            <input className={inputClass} value={form.github} onChange={set('github')} placeholder="github.com/you" />
          </div>
          <div>
            <label className={labelClass}>Portfolio</label>
            <input className={inputClass} value={form.portfolio} onChange={set('portfolio')} placeholder="yoursite.com" />
          </div>
          <div>
            <label className={labelClass}>X / Twitter</label>
            <input className={inputClass} value={form.twitter} onChange={set('twitter')} placeholder="@you" />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className={cardClass}>
        <h2 className="font-display text-lg font-bold tracking-tight">Skills</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills added yet.</p>
          ) : (
            skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => setSkills((s) => s.filter((x) => x !== skill))}
                  aria-label={`Remove ${skill}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill and press Enter"
          />
          <Button type="button" onClick={addSkill} className="shrink-0">
            Add
          </Button>
        </div>
      </section>

      <RepeatableSection
        title="Experience"
        rows={experience}
        onAdd={() => setExperience((r) => [...r, {}])}
        onRemove={(i) => setExperience((r) => r.filter((_, idx) => idx !== i))}
        renderRow={(row, i) => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input className={inputClass} placeholder="Title" value={row.title ?? ''} onChange={(e) => setExperience((r) => r.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))} />
            <input className={inputClass} placeholder="Company" value={row.company ?? ''} onChange={(e) => setExperience((r) => r.map((x, idx) => (idx === i ? { ...x, company: e.target.value } : x)))} />
            <input className={inputClass} placeholder="Start (e.g. 2021)" value={row.start ?? ''} onChange={(e) => setExperience((r) => r.map((x, idx) => (idx === i ? { ...x, start: e.target.value } : x)))} />
            <input className={inputClass} placeholder="End (e.g. Present)" value={row.end ?? ''} onChange={(e) => setExperience((r) => r.map((x, idx) => (idx === i ? { ...x, end: e.target.value } : x)))} />
            <textarea rows={2} className={`${inputClass} sm:col-span-2`} placeholder="What you did" value={row.description ?? ''} onChange={(e) => setExperience((r) => r.map((x, idx) => (idx === i ? { ...x, description: e.target.value } : x)))} />
          </div>
        )}
      />

      <RepeatableSection
        title="Education"
        rows={education}
        onAdd={() => setEducation((r) => [...r, {}])}
        onRemove={(i) => setEducation((r) => r.filter((_, idx) => idx !== i))}
        renderRow={(row, i) => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input className={inputClass} placeholder="School" value={row.school ?? ''} onChange={(e) => setEducation((r) => r.map((x, idx) => (idx === i ? { ...x, school: e.target.value } : x)))} />
            <input className={inputClass} placeholder="Degree" value={row.degree ?? ''} onChange={(e) => setEducation((r) => r.map((x, idx) => (idx === i ? { ...x, degree: e.target.value } : x)))} />
            <input className={inputClass} placeholder="Start" value={row.start ?? ''} onChange={(e) => setEducation((r) => r.map((x, idx) => (idx === i ? { ...x, start: e.target.value } : x)))} />
            <input className={inputClass} placeholder="End" value={row.end ?? ''} onChange={(e) => setEducation((r) => r.map((x, idx) => (idx === i ? { ...x, end: e.target.value } : x)))} />
          </div>
        )}
      />

      <RepeatableSection
        title="Projects"
        rows={projects}
        onAdd={() => setProjects((r) => [...r, {}])}
        onRemove={(i) => setProjects((r) => r.filter((_, idx) => idx !== i))}
        renderRow={(row, i) => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input className={inputClass} placeholder="Name" value={row.name ?? ''} onChange={(e) => setProjects((r) => r.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))} />
            <input className={inputClass} placeholder="Link" value={row.link ?? ''} onChange={(e) => setProjects((r) => r.map((x, idx) => (idx === i ? { ...x, link: e.target.value } : x)))} />
            <textarea rows={2} className={`${inputClass} sm:col-span-2`} placeholder="Description" value={row.description ?? ''} onChange={(e) => setProjects((r) => r.map((x, idx) => (idx === i ? { ...x, description: e.target.value } : x)))} />
          </div>
        )}
      />

      <RepeatableSection
        title="Certifications"
        rows={certifications}
        onAdd={() => setCertifications((r) => [...r, {}])}
        onRemove={(i) => setCertifications((r) => r.filter((_, idx) => idx !== i))}
        renderRow={(row, i) => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input className={inputClass} placeholder="Name" value={row.name ?? ''} onChange={(e) => setCertifications((r) => r.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))} />
            <input className={inputClass} placeholder="Issuer" value={row.issuer ?? ''} onChange={(e) => setCertifications((r) => r.map((x, idx) => (idx === i ? { ...x, issuer: e.target.value } : x)))} />
            <input className={inputClass} placeholder="Year" value={row.year ?? ''} onChange={(e) => setCertifications((r) => r.map((x, idx) => (idx === i ? { ...x, year: e.target.value } : x)))} />
          </div>
        )}
      />

      <RepeatableSection
        title="Languages"
        rows={languages}
        onAdd={() => setLanguages((r) => [...r, {}])}
        onRemove={(i) => setLanguages((r) => r.filter((_, idx) => idx !== i))}
        renderRow={(row, i) => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input className={inputClass} placeholder="Language" value={row.name ?? ''} onChange={(e) => setLanguages((r) => r.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))} />
            <select className={inputClass} value={row.proficiency ?? ''} onChange={(e) => setLanguages((r) => r.map((x, idx) => (idx === i ? { ...x, proficiency: e.target.value } : x)))}>
              <option value="">Proficiency</option>
              <option>Basic</option>
              <option>Conversational</option>
              <option>Fluent</option>
              <option>Native</option>
            </select>
          </div>
        )}
      />

      <div className="flex items-center justify-end gap-3 pb-6">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Save changes
        </Button>
      </div>
    </div>
  );
}

interface RepeatableSectionProps<T> {
  title: string;
  rows: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderRow: (row: T, index: number) => React.ReactNode;
}

function RepeatableSection<T>({ title, rows, onAdd, onRemove, renderRow }: RepeatableSectionProps<T>) {
  return (
    <section className={cardClass}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="size-4" /> Add
        </Button>
      </div>
      <div className="mt-5 space-y-4">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing added yet.</p>
        ) : (
          rows.map((row, i) => (
            <div key={i} className="rounded-xl border border-border p-4">
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="size-3.5" /> Remove
                </button>
              </div>
              {renderRow(row, i)}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
