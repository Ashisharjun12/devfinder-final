'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="text-muted-foreground mb-4">
        {error === 'AccessDenied' 
          ? 'You do not have permission to sign in.'
          : 'An error occurred while trying to sign in.'}
      </p>
      <Link href="/auth/signin">
        <Button>Try Again</Button>
      </Link>
    </div>
  );
}
