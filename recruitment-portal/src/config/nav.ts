export interface NavItem {
  title: string;
  href: string;
}

/**
 * Primary navigation shown in the header and mobile menu.
 * Keep this as the single source of truth for top-level routes.
 */
export const mainNav: NavItem[] = [
  { title: 'Jobs', href: '/jobs' },
  { title: 'Candidates', href: '/candidates' },
  { title: 'Applications', href: '/applications' },
];

export const footerNav: NavItem[] = [
  { title: 'Jobs', href: '/jobs' },
  { title: 'Candidates', href: '/candidates' },
  { title: 'Applications', href: '/applications' },
];
