import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Jobs',
};

export default function JobsPage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="Jobs"
        description="Open positions across the organization."
        action={<Button>Post a job</Button>}
      />
      <div className="mt-8">
        {/* Wire this to useJobs() once the backend is connected. */}
        <EmptyState
          title="No jobs yet"
          description="Posted roles will appear here. Connect the API to load live data."
          action={<Button variant="outline">Post the first job</Button>}
        />
      </div>
    </Container>
  );
}
