'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Bell,
  Bookmark,
  Calendar,
  Eye,
  FileText,
  Loader2,
  LogOut,
  Star,
} from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';
import { useLogout } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { getProfileCompletion, getMissingProfileItems } from '@/lib/profile-completion';
import { jobs } from '@/data/home';
import {
  applications,
  dashboardStats,
  notifications,
  recommendedIds,
  savedIds,
  statusBadgeClass,
  type Notification,
} from '@/data/dashboard';

const jobById = (id: string) => jobs.find((job) => job.id === id);

const statIcon: Record<string, React.ReactNode> = {
  apps: <FileText className="size-5" aria-hidden="true" />,
  interviews: <Calendar className="size-5" aria-hidden="true" />,
  saved: <Bookmark className="size-5" aria-hidden="true" />,
  views: <Eye className="size-5" aria-hidden="true" />,
};

const notifIcon: Record<Notification['icon'], React.ReactNode> = {
  eye: <Eye className="size-4" aria-hidden="true" />,
  star: <Star className="size-4" aria-hidden="true" />,
  calendar: <Calendar className="size-4" aria-hidden="true" />,
  bell: <Bell className="size-4" aria-hidden="true" />,
};

export function DashboardView() {
  const { user } = useAuth();
  const logout = useLogout();
  const router = useRouter();

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  const onLogout = async () => {
    await logout.mutateAsync();
    router.replace('/login');
  };

  const completion = getProfileCompletion(user);
  const missing = getMissingProfileItems(user);
  const recommended = recommendedIds.map(jobById).filter(Boolean);
  const saved = savedIds.map(jobById).filter(Boolean);

  return (
    <ProtectedRoute>
      <Container className="py-8 sm:py-10">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground font-display text-base font-bold text-background">
              {initials || 'U'}
            </span>
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/profile">My profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/jobs">
                Find new roles
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button onClick={onLogout} disabled={logout.isPending}>
              {logout.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="size-4" aria-hidden="true" />
              )}
              Sign out
            </Button>
          </div>
        </div>

        {/* Profile strength */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Profile strength</p>
              <p className="font-mono text-sm">{completion}%</p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {completion >= 100
                ? 'Your profile is complete. Recruiters can see the full picture.'
                : missing.length
                  ? `Add ${missing.join(' and ')} to reach the top of recruiter searches.`
                  : 'Complete your profile to reach the top of recruiter searches.'}
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/profile">Complete profile</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <div key={stat.key} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  {statIcon[stat.key]}
                </span>
                {stat.note ? (
                  <span className="font-mono text-xs text-muted-foreground">{stat.note}</span>
                ) : null}
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two column body */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Recent applications */}
            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="font-display text-lg font-bold tracking-tight">Recent applications</h2>
                <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  View all
                </Link>
              </div>
              <div>
                {applications.map((app) => {
                  const job = jobById(app.id);
                  if (!job) return null;
                  return (
                    <Link
                      key={app.id}
                      href={`/jobs/${job.id}`}
                      className="flex items-center gap-4 border-b border-border px-5 py-4 transition-colors last:border-0 hover:bg-muted"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-sm font-bold">
                        {job.company.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{job.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {job.company} &middot; {job.loc}
                        </p>
                      </div>
                      <span className="hidden text-xs text-muted-foreground sm:block">{app.date}</span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass[app.status]}`}
                      >
                        {app.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Recommended */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold tracking-tight">Recommended for you</h2>
                <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  See more
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recommended.map((job) => (
                  <Link
                    key={job!.id}
                    href={`/jobs/${job!.id}`}
                    className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-foreground"
                  >
                    <div>
                      <h3 className="font-display text-base font-bold leading-tight tracking-tight">
                        {job!.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {job!.company} &middot; {job!.loc}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="font-mono text-sm font-medium">{job!.pay}</span>
                      <ArrowRight className="size-4 text-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Side column */}
          <div className="space-y-6">
            {/* Notifications */}
            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="font-display text-lg font-bold tracking-tight">Notifications</h2>
              </div>
              <div>
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border-b border-border px-5 py-4 last:border-0"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      {notifIcon[n.icon]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{n.text}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.time} ago</p>
                    </div>
                    {n.unread ? (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-foreground" aria-label="Unread" />
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            {/* Saved jobs */}
            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="font-display text-lg font-bold tracking-tight">Saved jobs</h2>
                <span className="font-mono text-xs text-muted-foreground">{saved.length}</span>
              </div>
              <div>
                {saved.map((job) => (
                  <Link
                    key={job!.id}
                    href={`/jobs/${job!.id}`}
                    className="flex items-center gap-3 border-b border-border px-5 py-4 transition-colors last:border-0 hover:bg-muted"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-sm font-bold">
                      {job!.company.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{job!.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{job!.company}</p>
                    </div>
                    <Bookmark className="size-4 shrink-0 fill-foreground text-foreground" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
