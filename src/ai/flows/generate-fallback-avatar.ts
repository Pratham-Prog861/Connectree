'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a fallback avatar image.
 *
 * It checks if an avatar URL/data is valid, and if not, generates a fallback avatar image using AI.
 * - generateFallbackAvatar - The function to generate a fallback avatar if the provided URL is invalid.
 * - GenerateFallbackAvatarInput - The input type for the generateFallbackAvatar function.
 * - GenerateFallbackAvatarOutput - The output type for the generateFallbackAvatar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFallbackAvatarInputSchema = z.object({
  avatarUrl: z
    .string()
    .describe('The URL or data URI of the avatar image to check and potentially replace.'),
});
export type GenerateFallbackAvatarInput = z.infer<typeof GenerateFallbackAvatarInputSchema>;

const GenerateFallbackAvatarOutputSchema = z.object({
  avatarDataUri: z
    .string()
    .describe(
      'A data URI containing the fallback avatar image in case the original URL was invalid, or the original URL/data URI if valid.'
    ),
});
export type GenerateFallbackAvatarOutput = z.infer<typeof GenerateFallbackAvatarOutputSchema>;

export async function generateFallbackAvatar(
  input: GenerateFallbackAvatarInput
): Promise<GenerateFallbackAvatarOutput> {
  return generateFallbackAvatarFlow(input);
}

const generateFallbackAvatarFlow = ai.defineFlow(
  {
    name: 'generateFallbackAvatarFlow',
    inputSchema: GenerateFallbackAvatarInputSchema,
    outputSchema: GenerateFallbackAvatarOutputSchema,
  },
  async input => {
    try {
      // Check if the URL is a valid http/https or a data URI
      if (
        !input.avatarUrl.startsWith('http') &&
        !input.avatarUrl.startsWith('data:image')
      ) {
        console.log('Invalid Avatar URL/data, generating fallback avatar.');
        const {media} = await ai.generate({
          model: 'googleai/imagen-4.0-fast-generate-001',
          prompt: `Generate a simple, colorful, and abstract avatar image that can be used as a profile picture. The image should be in PNG format.`,
        });

        if (!media || !media.url) {
          throw new Error('Failed to generate fallback avatar.');
        }
        return {avatarDataUri: media.url};
      }

      // If the URL or data URI seems valid, return it directly
      return {avatarDataUri: input.avatarUrl};
    } catch (error: any) {
      console.error('Error during avatar generation or validation:', error);
      // If there's an error, return a default avatar or an error message
      throw new Error(`Avatar URL invalid and fallback failed: ${error.message}`);
    }
  }
);
