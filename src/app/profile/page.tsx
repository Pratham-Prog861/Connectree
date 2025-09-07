"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

interface ProfileLink {
  label: string;
  url: string;
}

interface ProfileData {
  name: string;
  bio?: string;
  avatar: string;
  links: ProfileLink[];
}

function ProfileContent() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = searchParams.get('data');
    
    if (!data) {
      setError('No profile data found in URL');
      setLoading(false);
      return;
    }

    try {
      // Decode the base64 encoded profile data
      const decodedData = atob(decodeURIComponent(data));
      const profile = JSON.parse(decodedData) as ProfileData;
      
      // Validate the profile structure
      if (!profile.name || !profile.links || !Array.isArray(profile.links)) {
        throw new Error('Invalid profile data structure');
      }
      
      setProfileData(profile);
    } catch (error) {
      console.error('Failed to parse profile data:', error);
      setError('Invalid or corrupted profile data');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {error || 'This profile link appears to be invalid or corrupted.'}
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8 max-w-2xl">
        <header className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Creator
            </Button>
          </Link>
          <ThemeToggle />
        </header>

        <main>
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Avatar */}
                <div className="flex justify-center">
                  <Image
                    src={profileData.avatar}
                    alt={`${profileData.name}'s avatar`}
                    width={120}
                    height={120}
                    className="rounded-full aspect-square object-cover border-4 border-muted"
                  />
                </div>

                {/* Name */}
                <h1 className="text-3xl font-bold font-headline text-foreground">
                  {profileData.name}
                </h1>

                {/* Bio */}
                {profileData.bio && (
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    {profileData.bio}
                  </p>
                )}

                {/* Links */}
                <div className="space-y-3 max-w-sm mx-auto">
                  {profileData.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full justify-between group">
                        <span>{link.label}</span>
                        <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </a>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-8 border-t border-muted">
                  <p className="text-xs text-muted-foreground">
                    Created with{' '}
                    <Link href="/" className="underline hover:text-foreground">
                      Connectree
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
