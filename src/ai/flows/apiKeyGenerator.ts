'use server';
/**
 * @fileOverview A secure API key generation flow.
 *
 * - generateApiKey: Generates a new, secure API key.
 * - ApiKeyInput: The input type for the generateApiKey function.
 * - ApiKeyOutput: The return type for the generateApiKey function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as crypto from 'crypto';

const ApiKeyInputSchema = z.object({
  description: z.string().describe('A description for what this API key will be used for.'),
});
export type ApiKeyInput = z.infer<typeof ApiKeyInputSchema>;

const ApiKeyOutputSchema = z.object({
  apiKey: z.string().describe('The generated secure API key.'),
});
export type ApiKeyOutput = z.infer<typeof ApiKeyOutputSchema>;

const generateApiKeyFlow = ai.defineFlow(
  {
    name: 'generateApiKeyFlow',
    inputSchema: ApiKeyInputSchema,
    outputSchema: ApiKeyOutputSchema,
  },
  async (input) => {
    // Generate 32 bytes of random data for a strong key
    const apiKey = `sk_${crypto.randomBytes(32).toString('hex')}`;
    
    // In a real application, you would save a hash of this key to a database
    // associated with the input.description or a user ID.
    // For this example, we just return the key.
    
    return {
      apiKey,
    };
  }
);

/**
 * Generates a new secure API key.
 * @param input - The input containing a description for the key.
 * @returns A promise that resolves to an object containing the new API key.
 */
export async function generateApiKey(input: ApiKeyInput): Promise<ApiKeyOutput> {
  return generateApiKeyFlow(input);
}
