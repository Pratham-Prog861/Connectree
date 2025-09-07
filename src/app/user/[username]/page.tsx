"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getIconForLabel } from '@/lib/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft } from 'lucide-react';

interface LinkItem {
  label: string;
  url: string;
}

interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  links: LinkItem[];
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/users/${username}.json`);
          if (!res.ok) {
            throw new Error('User not found');
          }
          const data = await res.json();
          setUser(data);
        } catch (err) {
            if (err instanceof Error) {
                 setError(err.message);
            } else {
                setError('An unknown error occurred')
            }
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [username]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error: {error}</h2>
        <p className="text-muted-foreground">Could not find a profile for "{username}".</p>
        <Button asChild className="mt-6">
          <Link href="/">Create a Profile</Link>
        </Button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background w-full flex items-center justify-center p-4">
       <header className="absolute top-4 right-4 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/"><ArrowLeft className="h-4 w-4"/></Link>
          </Button>
          <ThemeToggle />
        </header>

      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4 ring-4 ring-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="profile picture" />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold font-headline">{user.name}</h1>
            <p className="text-muted-foreground mt-1">{user.bio}</p>
          </div>

          <div className="mt-8 flex flex-col space-y-4">
            {user.links.map((link, index) => {
              const Icon = getIconForLabel(link.label);
              return (
                <Button
                  key={index}
                  asChild
                  className="w-full justify-start transition-transform duration-200 hover:scale-105"
                  size="lg"
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Icon className="mr-4 h-5 w-5" />
                    <span className="truncate">{link.label}</span>
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="w-24 h-24 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="mt-8 flex flex-col space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
