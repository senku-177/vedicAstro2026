import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SuccessClient = dynamic(() => import('./SuccessClient'));

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
