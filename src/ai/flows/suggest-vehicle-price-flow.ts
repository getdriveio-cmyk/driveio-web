'use server';
/**
 * @fileOverview An AI flow for suggesting a competitive daily price for a vehicle listing.
 *
 * - suggestVehiclePrice - A function that handles the price suggestion process.
 * - SuggestVehiclePriceInput - The input type for the suggestVehiclePrice function.
 * - SuggestVehiclePriceOutput - The return type for the suggestVehiclePrice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestVehiclePriceInputSchema = z.object({
  make: z.string().describe('The make of the vehicle (e.g., Tesla).'),
  model: z.string().describe('The model of the vehicle (e.g., Model 3).'),
  year: z.number().describe('The year the vehicle was manufactured.'),
  location: z.string().describe('The city and state where the vehicle is located (e.g., San Francisco, CA).'),
});
export type SuggestVehiclePriceInput = z.infer<typeof SuggestVehiclePriceInputSchema>;

const SuggestVehiclePriceOutputSchema = z.object({
    price: z.number().describe('A suggested competitive daily rental price for the vehicle.'),
});
export type SuggestVehiclePriceOutput = z.infer<typeof SuggestVehiclePriceOutputSchema>;

export async function suggestVehiclePrice(input: SuggestVehiclePriceInput): Promise<SuggestVehiclePriceOutput> {
  return suggestVehiclePriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestVehiclePricePrompt',
  input: { schema: SuggestVehiclePriceInputSchema },
  output: { schema: SuggestVehiclePriceOutputSchema },
  prompt: `You are an expert automotive market analyst for a car rental marketplace called DriveIO. Your task is to suggest a competitive daily rental price for a vehicle based on its details.

Consider the vehicle's make, model, year, and location to determine a fair market price. The price should be a whole number.

Vehicle Details:
- Make: {{{make}}}
- Model: {{{model}}}
- Year: {{{year}}}
- Location: {{{location}}}

Suggest a daily price.
`,
});

const suggestVehiclePriceFlow = ai.defineFlow(
  {
    name: 'suggestVehiclePriceFlow',
    inputSchema: SuggestVehiclePriceInputSchema,
    outputSchema: SuggestVehiclePriceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      // Return a default price if AI fails
      return { price: 100 };
    }
    return output;
  }
);
