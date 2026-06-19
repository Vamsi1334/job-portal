import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Job detail',
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  return (
    <Container className="py-10">
      <PageHeader
        title="Job detail"
        description={`Showing job ${id}. Wire this to useJob(id) for live data.`}
        action={<Button>Apply</Button>}
      />
    </Container>
  );
}
