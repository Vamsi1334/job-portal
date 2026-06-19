import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { ProtectedRoute } from '@/components/auth/protected-route';

export const metadata: Metadata = {
  title: 'Candidates',
};

export default function CandidatesPage() {
  return (
    <ProtectedRoute>
      <Container className="py-10">
        <PageHeader title="Candidates" description="People in your hiring pipeline." />
        <div className="mt-8">
          <EmptyState
            title="No candidates yet"
            description="Candidate profiles will appear here once the API is connected."
          />
        </div>
      </Container>
    </ProtectedRoute>
  );
}
