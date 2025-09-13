'use server';
/**
 * @fileOverview An AI flow for suggesting common features for a vehicle.
 *
 * - suggestVehicleFeatures - A function that handles the feature suggestion process.
 * - SuggestVehicleFeaturesInput - The input type for the suggestVehicleFeatures function.
 * - SuggestVehicleFeaturesOutput - The return type for the suggestVehicleFeatures function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestVehicleFeaturesInputSchema = z.object({
  make: z.string().describe('The make of the vehicle (e.g., Tesla).'),
  model: z.string().describe('The model of the vehicle (e.g., Model 3).'),
  year: z.number().describe('The year the vehicle was manufactured.'),
});
export type SuggestVehicleFeaturesInput = z.infer<typeof SuggestVehicleFeaturesInputSchema>;

const SuggestVehicleFeaturesOutputSchema = z.object({
    features: z.string().describe('A comma-separated list of 3-5 common or likely features for the specified vehicle.'),
});
export type SuggestVehicleFeaturesOutput = z.infer<typeof SuggestVehicleFeaturesOutputSchema>;

export async function suggestVehicleFeatures(input: SuggestVehicleFeaturesInput): Promise<SuggestVehicleFeaturesOutput> {
  return suggestVehicleFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestVehicleFeaturesPrompt',
  input: { schema: SuggestVehicleFeaturesInputSchema },
  output: { schema: SuggestVehicleFeaturesOutputSchema },
  prompt: `You are an automotive expert. Based on the vehicle details provided, suggest a comma-separated list of 3-5 common or likely features. Do not add any introductory text.

Vehicle Details:
- Make: {{{make}}}
- Model: {{{model}}}
- Year: {{{year}}}

Suggest the features.
`,
});

const suggestVehicleFeaturesFlow = ai.defineFlow(
  {
    name: 'suggestVehicleFeaturesFlow',
    inputSchema: SuggestVehicleFeaturesInputSchema,
    outputSchema: SuggestVehicleFeaturesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      return { features: '' };
    }
    return output;
  }
);
