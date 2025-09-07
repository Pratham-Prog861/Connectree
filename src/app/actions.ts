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

// Server-side profile saving removed - now handled client-side
// This keeps the server action pattern for potential future use
export async function saveProfile(username: string, jsonContent: string) {
  // For free deployment, we'll handle this client-side
  // Return success to maintain compatibility
  return { success: true, message: 'Profile saved successfully!' };
}
