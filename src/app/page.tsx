"use client";

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Loader2, Copy, Rocket } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { generateAvatarAction, saveProfile } from './actions';
import { useToast } from "@/hooks/use-toast"

const linkSchema = z.object({
  label: z.string().min(1, 'Label is required.'),
  url: z.string().url('Please enter a valid URL.'),
});

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  bio: z.string().max(160, 'Bio must be 160 characters or less.').optional(),
  avatar: z.string().url('Please enter a valid image URL.').or(z.literal('')).optional(),
  links: z.array(linkSchema).min(1, 'At least one link is required.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Helper function to create a URL-friendly slug from a string
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -


export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedJson, setGeneratedJson] = useState('');
  const [username, setUsername] = useState('your-name');
  const { toast } = useToast()

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      bio: '',
      avatar: '',
      links: [{ label: '', url: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  // Watch the name field and update the username slug
  const watchedName = watch('name');
  useEffect(() => {
    if (watchedName) {
      setUsername(slugify(watchedName));
    } else {
      setUsername('your-name');
    }
    setGeneratedJson(''); // Clear JSON when name changes
  }, [watchedName]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    setGeneratedJson('');

    try {
      const finalAvatar = await generateAvatarAction(data.avatar || '');
      
      const profileData = {
        ...data,
        avatar: finalAvatar,
      };

      const jsonString = JSON.stringify(profileData, null, 2);
      setGeneratedJson(jsonString);
      
      toast({
        title: "JSON Generated!",
        description: "You can now make your profile live.",
      });
      
    } catch (error) {
      console.error('An error occurred:', error);
      toast({
        title: "Error",
        description: "An error occurred while generating the JSON.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyJson = () => {
    if(!generatedJson) return;
    navigator.clipboard.writeText(generatedJson);
    toast({
        title: "Copied!",
        description: "JSON copied to clipboard.",
      })
  }

  const getShareableLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/user/${username}`;
    }
    return '';
  }
  
  const handleGoLive = async () => {
    if (!generatedJson || !username || username === 'your-name') {
      toast({
        title: "Cannot go live",
        description: "Please generate your JSON first and enter a name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const result = await saveProfile(username, generatedJson);
      if (result.success) {
        toast({
          title: "You're Live!",
          description: "Your profile is now public. Opening it for you...",
        });
        window.open(getShareableLink(), '_blank');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
       console.error('Failed to go live:', error);
       const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
       toast({
         title: "Error Going Live",
         description: errorMessage,
         variant: "destructive",
       });
    } finally {
        setIsSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-background w-full">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-headline text-foreground">LinkJSON Creator</h1>
          <ThemeToggle />
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Profile</CardTitle>
              <CardDescription>
                Fill in your details to generate a shareable JSON file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register('name')} placeholder="John Doe" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" {...register('bio')} placeholder="Frontend Developer & Tech Enthusiast" />
                  {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input id="avatar" {...register('avatar')} placeholder="https://your-image-url.com/avatar.png" />
                   <p className="text-xs text-muted-foreground">If left blank or invalid, an AI-generated avatar will be used.</p>
                  {errors.avatar && <p className="text-sm text-destructive">{errors.avatar.message}</p>}
                </div>
                
                <div>
                  <Label className="block mb-2">Links</Label>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-start gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow">
                          <Input
                            placeholder="Label (e.g., GitHub)"
                            {...register(`links.${index}.label`)}
                          />
                          <Input
                            placeholder="URL"
                            {...register(`links.${index}.url`)}
                            />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {errors.links && <p className="text-sm text-destructive">{errors.links.message || errors.links.root?.message}</p>}
                    
                  </div>
                   <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => append({ label: '', url: '' })}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Link
                    </Button>
                </div>


                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating JSON...
                    </>
                  ) : (
                    'Generate JSON'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
              <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Generated JSON</CardTitle>
                            <CardDescription>
                                Your profile JSON will appear here.
                            </CardDescription>
                        </div>
                        {generatedJson && (
                            <Button variant="ghost" size="icon" onClick={copyJson} aria-label="Copy JSON">
                                <Copy className="h-5 w-5"/>
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                  <pre className="w-full bg-muted p-4 rounded-md overflow-x-auto text-sm h-64">
                    <code>
                      {generatedJson || "Your generated JSON will appear here..."}
                    </code>
                  </pre>
                </CardContent>
              </Card>
               {generatedJson && (
                 <Card>
                    <CardHeader>
                      <CardTitle>You're ready to go live!</CardTitle>
                      <CardDescription>
                        Click the button below to publish your profile and get your shareable link.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Your shareable link will be:</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input readOnly value={getShareableLink()} className="bg-muted"/>
                              <Button onClick={() => {
                                navigator.clipboard.writeText(getShareableLink());
                                toast({ title: "Copied!", description: "Link copied to clipboard." });
                              }}>
                                <Copy className="h-4 w-4"/>
                              </Button>
                            </div>
                         </div>
                        <Button onClick={handleGoLive} className="w-full" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Publishing...
                                </>
                              ) : (
                                <>
                                  <Rocket className="mr-2 h-4 w-4" />
                                  Go Live & Share
                                </>
                              )}
                        </Button>
                         <p className="text-xs text-muted-foreground text-center">
                            You can also see an example at <a href="/user/linkjson" target="_blank" className="underline">/user/linkjson</a>.
                        </p>
                    </CardContent>
                 </Card>
                )}
          </div>
        </main>
      </div>
    </div>
  );
}
