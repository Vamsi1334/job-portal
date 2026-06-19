/**
 * Landing-page content for the home screen.
 *
 * Ported verbatim from the single-file HTML preview (recruitment-portal-app.html)
 * so the real Next.js home page shows the same jobs, categories, companies, and
 * stories. Treat this as static demo content until the listings API is wired up.
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  loc: string;
  mode: 'Remote' | 'On-site' | 'Hybrid';
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  cat: string;
  pay: string;
  salaryNum: number;
  tags: string[];
  age: string;
  postedDays: number;
  desc: string;
}

export interface Category {
  name: string;
  count: string;
}

export interface Company {
  name: string;
  sector: string;
  open: number;
}

export interface Story {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const jobs: Job[] = [
  { id: 'pd-monoline', title: 'Senior Product Designer', company: 'Monoline', loc: 'Remote', mode: 'Remote', level: 'Senior', type: 'Full-time', cat: 'Design', pay: '$120k - $150k', salaryNum: 135000, tags: ['Design', 'Figma'], age: '2d', postedDays: 2, desc: 'Own the end to end design of our hiring product, from first sketch to shipped flow. Partner with product and engineering to turn fuzzy problems into clean, usable interfaces.' },
  { id: 'se-northwind', title: 'Staff Software Engineer', company: 'Northwind', loc: 'Berlin', mode: 'On-site', level: 'Lead', type: 'Full-time', cat: 'Engineering', pay: '€95k - €120k', salaryNum: 107000, tags: ['Go', 'Kubernetes'], age: '1d', postedDays: 1, desc: 'Lead the design of services that handle millions of applications a month. Set technical direction and mentor a team of strong engineers.' },
  { id: 'da-aperture', title: 'Data Analyst', company: 'Aperture', loc: 'London', mode: 'Hybrid', level: 'Mid', type: 'Full-time', cat: 'Data & Analytics', pay: '£55k - £70k', salaryNum: 62000, tags: ['SQL', 'Python'], age: '4h', postedDays: 0, desc: 'Turn raw product data into decisions. Build dashboards, run analyses, and tell the story behind the numbers to non technical teams.' },
  { id: 'bs-halcyon', title: 'Brand Strategist', company: 'Halcyon', loc: 'Austin', mode: 'Hybrid', level: 'Mid', type: 'Contract', cat: 'Marketing', pay: '$80k - $100k', salaryNum: 90000, tags: ['Brand', 'Content'], age: '3d', postedDays: 3, desc: 'Shape how the brand sounds and feels across every touchpoint. Define voice, run campaigns, and keep the story consistent.' },
  { id: 'do-ironwood', title: 'DevOps Lead', company: 'Ironwood', loc: 'Remote', mode: 'Remote', level: 'Lead', type: 'Full-time', cat: 'Engineering', pay: '$135k - $165k', salaryNum: 150000, tags: ['AWS', 'CI/CD'], age: '5d', postedDays: 5, desc: 'Build the platform other engineers depend on. Own CI/CD, observability, and the path from commit to production.' },
  { id: 'ae-borealis', title: 'Account Executive', company: 'Borealis', loc: 'New York', mode: 'On-site', level: 'Mid', type: 'Full-time', cat: 'Sales', pay: '$70k + comm', salaryNum: 70000, tags: ['SaaS', 'B2B'], age: '6h', postedDays: 0, desc: 'Run the full sales cycle for mid market accounts. Prospect, demo, negotiate, and close.' },
  { id: 'pm-lumen', title: 'Product Manager', company: 'Lumen', loc: 'Toronto', mode: 'Hybrid', level: 'Senior', type: 'Full-time', cat: 'Product', pay: '$110k - $140k', salaryNum: 125000, tags: ['Roadmap', 'B2B'], age: '1w', postedDays: 7, desc: 'Own a core area of the product. Talk to users, set the roadmap, and ship things that move the metrics that matter.' },
  { id: 'fe-cascade', title: 'Frontend Engineer', company: 'Cascade', loc: 'Remote', mode: 'Remote', level: 'Mid', type: 'Full-time', cat: 'Engineering', pay: '$100k - $130k', salaryNum: 115000, tags: ['React', 'TypeScript'], age: '2d', postedDays: 2, desc: 'Build fast, accessible interfaces with React and TypeScript. Care about the details that make a product feel good to use.' },
  { id: 'ux-meridian', title: 'UX Researcher', company: 'Meridian', loc: 'Amsterdam', mode: 'On-site', level: 'Mid', type: 'Part-time', cat: 'Design', pay: '€45k - €60k', salaryNum: 52000, tags: ['Research', 'Interviews'], age: '3d', postedDays: 3, desc: 'Plan and run studies that answer the questions the team keeps arguing about. Turn interviews into clear, actionable insight.' },
  { id: 'sec-veltrix', title: 'Security Engineer', company: 'Veltrix', loc: 'Singapore', mode: 'On-site', level: 'Senior', type: 'Full-time', cat: 'Engineering', pay: '$130k - $150k', salaryNum: 140000, tags: ['Security', 'Cloud'], age: '4d', postedDays: 4, desc: 'Harden our platform and lead the response when things get interesting. Threat modeling, reviews, and incident response.' },
  { id: 'ds-aperture', title: 'Data Scientist', company: 'Aperture', loc: 'Remote', mode: 'Remote', level: 'Senior', type: 'Full-time', cat: 'Data & Analytics', pay: '$120k - $140k', salaryNum: 130000, tags: ['ML', 'Python'], age: '6d', postedDays: 6, desc: 'Build models that power matching and ranking. Own problems from framing through to a shipped, measured result.' },
  { id: 'mk-halcyon', title: 'Marketing Manager', company: 'Halcyon', loc: 'London', mode: 'Hybrid', level: 'Mid', type: 'Full-time', cat: 'Marketing', pay: '£60k - £80k', salaryNum: 88000, tags: ['SEO', 'Content'], age: '1w', postedDays: 8, desc: 'Run campaigns end to end and own the numbers behind them. Channels, content, and a clear story.' },
  { id: 'cs-borealis', title: 'Customer Success Manager', company: 'Borealis', loc: 'Remote', mode: 'Remote', level: 'Mid', type: 'Full-time', cat: 'Operations', pay: '$70k - $90k', salaryNum: 80000, tags: ['SaaS', 'Support'], age: '5d', postedDays: 5, desc: 'Own a book of accounts, drive adoption, and turn customers into advocates.' },
  { id: 'fin-lumen', title: 'Financial Analyst', company: 'Lumen', loc: 'New York', mode: 'On-site', level: 'Mid', type: 'Full-time', cat: 'Finance', pay: '$85k - $105k', salaryNum: 95000, tags: ['Excel', 'Modeling'], age: '3d', postedDays: 3, desc: 'Build the models that guide planning. Partner with leaders to turn numbers into decisions.' },
  { id: 'be-cascade', title: 'Backend Engineer', company: 'Cascade', loc: 'Remote', mode: 'Remote', level: 'Senior', type: 'Full-time', cat: 'Engineering', pay: '$130k - $160k', salaryNum: 145000, tags: ['Node', 'Postgres'], age: '2d', postedDays: 2, desc: 'Design and ship the services behind the product. Care about reliability and clean interfaces.' },
  { id: 'pd-veltrix', title: 'Product Designer', company: 'Veltrix', loc: 'Berlin', mode: 'Hybrid', level: 'Mid', type: 'Full-time', cat: 'Design', pay: '€75k - €95k', salaryNum: 92000, tags: ['Figma', 'UI'], age: '1d', postedDays: 1, desc: 'Design flows that feel obvious. Work closely with engineering to ship and iterate fast.' },
  { id: 'intern-monoline', title: 'Design Intern', company: 'Monoline', loc: 'Remote', mode: 'Remote', level: 'Entry', type: 'Internship', cat: 'Design', pay: '$30k - $40k', salaryNum: 35000, tags: ['Figma'], age: '2d', postedDays: 2, desc: 'Learn by shipping real work alongside senior designers. A summer of hands on projects.' },
  { id: 'ops-ironwood', title: 'Operations Lead', company: 'Ironwood', loc: 'Austin', mode: 'On-site', level: 'Lead', type: 'Full-time', cat: 'Operations', pay: '$100k - $120k', salaryNum: 110000, tags: ['Process', 'People'], age: '6d', postedDays: 6, desc: 'Keep the engine running. Build process where it helps and remove it where it does not.' },
  { id: 'sales-veltrix', title: 'Sales Development Rep', company: 'Veltrix', loc: 'Remote', mode: 'Remote', level: 'Entry', type: 'Full-time', cat: 'Sales', pay: '$50k - $60k', salaryNum: 55000, tags: ['Outbound', 'CRM'], age: '1d', postedDays: 1, desc: 'Open conversations with new accounts and set up the team to win them.' },
  { id: 'pm-cascade', title: 'Associate Product Manager', company: 'Cascade', loc: 'Toronto', mode: 'Hybrid', level: 'Entry', type: 'Full-time', cat: 'Product', pay: '$75k - $90k', salaryNum: 82000, tags: ['Roadmap'], age: '4d', postedDays: 4, desc: 'Learn the craft on a real surface. Talk to users, scope work, and help ship it.' },
  { id: 'ml-northwind', title: 'Machine Learning Engineer', company: 'Northwind', loc: 'Remote', mode: 'Remote', level: 'Senior', type: 'Full-time', cat: 'Data & Analytics', pay: '$140k - $170k', salaryNum: 155000, tags: ['PyTorch', 'MLOps'], age: '3d', postedDays: 3, desc: 'Take models from notebook to production and keep them healthy once they are there.' },
];

export const categories: Category[] = [
  { name: 'Engineering', count: '3,210' },
  { name: 'Design', count: '1,140' },
  { name: 'Product', count: '860' },
  { name: 'Data & Analytics', count: '1,025' },
  { name: 'Marketing', count: '1,480' },
  { name: 'Sales', count: '2,060' },
  { name: 'Operations', count: '740' },
  { name: 'Finance', count: '590' },
];

export const companies: Company[] = [
  { name: 'Northwind', sector: 'Cloud infrastructure', open: 14 },
  { name: 'Veltrix', sector: 'Fintech', open: 9 },
  { name: 'Monoline', sector: 'Design tools', open: 6 },
  { name: 'Aperture', sector: 'Analytics', open: 11 },
  { name: 'Halcyon', sector: 'Media', open: 4 },
  { name: 'Ironwood', sector: 'Developer tools', open: 8 },
  { name: 'Lumen', sector: 'SaaS', open: 7 },
  { name: 'Borealis', sector: 'Logistics', open: 13 },
  { name: 'Cascade', sector: 'Healthtech', open: 5 },
  { name: 'Meridian', sector: 'Education', open: 10 },
];

export const stories: Story[] = [
  { quote: 'I went from blind applications to three interviews in a week. The filters matched how I want to work.', name: 'Ananya R.', role: 'Product Designer at Monoline', initials: 'AR' },
  { quote: 'Clean, fast, no noise. I could see salary ranges up front, which saved everyone time.', name: 'Marcus K.', role: 'Staff Engineer at Northwind', initials: 'MK' },
  { quote: 'The companies here reply. A recruiter messaged me within two days of my first application.', name: 'Lena F.', role: 'Data Analyst at Aperture', initials: 'LF' },
];

export const heroStats = [
  { value: 12480, suffix: '', label: 'Open roles' },
  { value: 3200, suffix: '+', label: 'Companies' },
  { value: 48, suffix: ' hrs', label: 'Median reply' },
];
