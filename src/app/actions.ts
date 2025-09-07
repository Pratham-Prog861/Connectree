'use server';

import { generateFallbackAvatar } from '@/ai/flows/generate-fallback-avatar';

export async function generateAvatarAction(avatarUrl: string) {
  try {
    // Treat empty string as an invalid URL for the AI flow
    const result = await generateFallbackAvatar({ avatarUrl: avatarUrl || 'invalid' });
    return result.avatarDataUri;
  } catch (error) {
    console.error('AI action failed:', error);
    // Provide a default placeholder if AI generation fails
    return 'https://picsum.photos/200'; 
  }
}
