import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CheckoutClient = dynamic(() => import('./CheckoutClient'));

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
