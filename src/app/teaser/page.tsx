import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const TeaserClient = dynamic(() => import('./TeaserClient'));

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading teaser…</div>}>
      <TeaserClient />
    </Suspense>
  );
}