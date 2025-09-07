"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProfile } from '@/lib/profile-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ShortUrlPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const params = useParams();
  const router = useRouter();
  const hash = params.hash as string;

  useEffect(() => {
    if (!hash) {
      setError('Invalid URL');
      setLoading(false);
      return;
    }

    try {
      // Try to get profile from localStorage
      const profileJson = getProfile(hash);
      
      if (!profileJson) {
        setError('Profile not found or expired');
        setLoading(false);
        return;
      }

      // Redirect to the profile page with the data
      const encodedProfile = btoa(profileJson);
      const profileUrl = `/profile?data=${encodeURIComponent(encodedProfile)}`;
      router.replace(profileUrl);
      
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile');
      setLoading(false);
    }
  }, [hash, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-destructive">Profile Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {error || 'This profile link has expired or doesn\'t exist.'}
          </p>
          <p className="text-sm text-muted-foreground">
            Profiles are stored locally in your browser and may expire after 30 days of inactivity.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Create Your Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
