/**
 * Demo content for the candidate dashboard, ported from the HTML preview.
 * Job references resolve against the shared `jobs` list in ./home.
 */

export interface Application {
  id: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';
  date: string;
}

export interface Notification {
  icon: 'eye' | 'star' | 'calendar' | 'bell';
  text: string;
  time: string;
  unread: boolean;
}

export const applications: Application[] = [
  { id: 'pm-lumen', status: 'Interview', date: 'Jun 14' },
  { id: 'fe-cascade', status: 'Screening', date: 'Jun 12' },
  { id: 'pd-monoline', status: 'Applied', date: 'Jun 11' },
  { id: 'da-aperture', status: 'Rejected', date: 'Jun 7' },
];

export const recommendedIds = ['se-northwind', 'ux-meridian'];
export const savedIds = ['do-ironwood', 'ae-borealis', 'bs-halcyon'];

export const notifications: Notification[] = [
  { icon: 'eye', text: 'Monoline viewed your application', time: '2h', unread: true },
  { icon: 'star', text: 'New match: Frontend Engineer at Cascade', time: '5h', unread: true },
  { icon: 'calendar', text: 'Interview scheduled with Lumen on Jun 20', time: '1d', unread: false },
  { icon: 'bell', text: 'Your weekly job digest is ready', time: '2d', unread: false },
];

export const dashboardStats = [
  { key: 'apps', value: '12', label: 'Applications', note: '+3 wk' },
  { key: 'interviews', value: '3', label: 'Interviews', note: '2 soon' },
  { key: 'saved', value: '3', label: 'Saved jobs', note: '' },
  { key: 'views', value: '47', label: 'Profile views', note: '+18%' },
];

export const statusBadgeClass: Record<Application['status'], string> = {
  Applied: 'border border-border text-foreground',
  Screening: 'bg-muted text-foreground',
  Interview: 'bg-foreground text-background',
  Offer: 'bg-foreground text-background',
  Rejected: 'bg-muted text-muted-foreground',
};
