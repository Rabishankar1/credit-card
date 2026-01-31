'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">
            Credit Card Application System
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">


          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={() => router.push('/application/new')}
          >
            New Application
          </Button>

          
          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={() => router.push('/application/login')}
          >
            Customer Login
          </Button>

          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push('/approvals/login')}
          >
            Approver Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
