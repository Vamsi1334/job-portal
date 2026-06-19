import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { ProtectedRoute } from '@/components/auth/protected-route';

export const metadata: Metadata = {
  title: 'Applications',
};

export default function ApplicationsPage() {
  return (
    <ProtectedRoute>
      <Container className="py-10">
        <PageHeader title="Applications" description="Track application status end to end." />
        <div className="mt-8">
          <EmptyState
            title="No applications yet"
            description="Submitted applications will appear here once the API is connected."
          />
        </div>
      </Container>
    </ProtectedRoute>
  );
}
