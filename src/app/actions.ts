'use server';

import { generateFallbackAvatar } from '@/ai/flows/generate-fallback-avatar';
import fs from 'fs';
import path from 'path';

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

export async function saveProfile(username: string, jsonContent: string) {
  if (!username.match(/^[a-z0-9-]+$/)) {
    throw new Error('Invalid username. Only lowercase letters, numbers, and hyphens are allowed.');
  }
  
  try {
    const dirPath = path.join(process.cwd(), 'public', 'users');
    // Ensure the directory exists
    await fs.promises.mkdir(dirPath, { recursive: true });
    
    const filePath = path.join(dirPath, `${username}.json`);
    await fs.promises.writeFile(filePath, jsonContent, 'utf8');
    
    return { success: true, message: 'Profile saved successfully!' };
  } catch (error) {
    console.error('Failed to save profile:', error);
    if (error instanceof Error) {
      return { success: false, message: `Failed to save profile: ${error.message}` };
    }
    return { success: false, message: 'An unknown error occurred while saving the profile.' };
  }
}
