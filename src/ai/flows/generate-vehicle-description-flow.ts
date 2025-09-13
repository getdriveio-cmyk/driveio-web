'use server';
/**
 * @fileOverview An AI flow for generating compelling vehicle descriptions for host listings.
 *
 * - generateVehicleDescription - A function that handles the description generation process.
 * - GenerateVehicleDescriptionInput - The input type for the generateVehicleDescription function.
 * - GenerateVehicleDescriptionOutput - The return type for the generateVehicleDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateVehicleDescriptionInputSchema = z.object({
  make: z.string().describe('The make of the vehicle (e.g., Tesla).'),
  model: z.string().describe('The model of the vehicle (e.g., Model 3).'),
  year: z.number().describe('The year the vehicle was manufactured.'),
  features: z.string().describe('A comma-separated list of key features (e.g., Electric, Autopilot, 4x4).'),
});
export type GenerateVehicleDescriptionInput = z.infer<typeof GenerateVehicleDescriptionInputSchema>;

const GenerateVehicleDescriptionOutputSchema = z.object({
    description: z.string().describe('A compelling, friendly, and enticing vehicle description for a rental marketplace listing.'),
});
export type GenerateVehicleDescriptionOutput = z.infer<typeof GenerateVehicleDescriptionOutputSchema>;

export async function generateVehicleDescription(input: GenerateVehicleDescriptionInput): Promise<GenerateVehicleDescriptionOutput> {
  return generateVehicleDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVehicleDescriptionPrompt',
  input: { schema: GenerateVehicleDescriptionInputSchema },
  output: { schema: GenerateVehicleDescriptionOutputSchema },
  prompt: `You are a creative copywriter for a car rental marketplace called DriveIO. Your task is to write a compelling, friendly, and enticing vehicle description for a host's listing.

The description should be about 2-3 sentences long. Highlight the key features and suggest an ideal use case for the vehicle to attract potential renters.

Vehicle Details:
- Make: {{{make}}}
- Model: {{{model}}}
- Year: {{{year}}}
- Key Features: {{{features}}}

Generate a description based on these details.
`,
});

const generateVehicleDescriptionFlow = ai.defineFlow(
  {
    name: 'generateVehicleDescriptionFlow',
    inputSchema: GenerateVehicleDescriptionInputSchema,
    outputSchema: GenerateVehicleDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      return { description: '' };
    }
    return output;
  }
);
