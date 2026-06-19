import { LoadingSpinner } from '@/components/common/loading-spinner';

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
