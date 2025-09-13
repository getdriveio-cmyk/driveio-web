
'use server';
/**
 * @fileOverview An AI flow for suggesting vehicles based on user's natural language trip descriptions.
 *
 * - suggestVehicles - A function that handles the vehicle suggestion process.
 * - VehicleSuggesterInput - The input type for the suggestVehicles function.
 * - VehicleSuggesterOutput - The return type for the suggestVehicles function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getVehicles } from '@/lib/firestore';
import type { Vehicle } from '@/lib/types';

const VehicleSuggesterInputSchema = z.object({
  tripDescription: z.string().describe('A natural language description of the trip and what kind of vehicle the user is looking for.'),
});
export type VehicleSuggesterInput = z.infer<typeof VehicleSuggesterInputSchema>;

const VehicleSuggestionSchema = z.object({
  vehicleId: z.string().describe('The ID of the suggested vehicle.'),
  reasoning: z.string().describe('A brief explanation of why this vehicle is a good match for the user\'s trip.'),
});

const VehicleSuggesterOutputSchema = z.object({
  suggestions: z.array(VehicleSuggestionSchema).describe('A list of up to 3 vehicle suggestions.'),
});
export type VehicleSuggesterOutput = z.infer<typeof VehicleSuggesterOutputSchema>;

export async function suggestVehicles(input: VehicleSuggesterInput): Promise<VehicleSuggesterOutput> {
  return suggestVehiclesFlow(input);
}

const searchVehiclesTool = ai.defineTool(
  {
    name: 'searchVehicles',
    description: 'Search for available rental vehicles based on specified criteria.',
    inputSchema: z.object({
      type: z.string().optional().describe('The type of vehicle (e.g., SUV, Sedan, Sports Car)'),
      features: z.array(z.string()).optional().describe('A list of desired features (e.g., Electric, 4x4, Autopilot)'),
      maxPrice: z.number().optional().describe('The maximum price per day for the rental.'),
    }),
    outputSchema: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        pricePerDay: z.number(),
        features: z.string(),
        description: z.string(),
    })),
  },
  async (input) => {
    // Call the updated getVehicles function with filters
    const results: Vehicle[] = await getVehicles(undefined, {
        type: input.type,
        features: input.features,
        maxPrice: input.maxPrice,
    });
    
    // Pass a simplified version of vehicle data to the LLM to save tokens and improve performance.
    return results.map(v => ({
        id: v.id,
        name: v.name,
        type: v.make,
        pricePerDay: v.pricePerDay,
        features: v.features.join(', '),
        description: v.description,
    }));
  }
);


const prompt = ai.definePrompt({
  name: 'vehicleSuggesterPrompt',
  input: { schema: VehicleSuggesterInputSchema },
  output: { schema: VehicleSuggesterOutputSchema },
  tools: [searchVehiclesTool],
  prompt: `You are an expert car rental assistant for a platform called DriveIO. Your goal is to help users find the perfect vehicle for their trip based on their description.

Analyze the user's trip description to understand their needs. Then, use the searchVehicles tool to find available cars that match those needs. You can use the tool multiple times if necessary to explore different options (e.g., try searching for an SUV, then a Sedan if the user seems flexible).

After gathering search results, suggest up to 3 of the best-fitting vehicles. For each suggestion, provide a concise reason explaining why it's a good choice for their specific trip.

User's trip description:
"{{{tripDescription}}}"

Please provide your final suggestions in the specified JSON output format. Do not ask for more information from the user.
`,
});

const suggestVehiclesFlow = ai.defineFlow(
  {
    name: 'suggestVehiclesFlow',
    inputSchema: VehicleSuggesterInputSchema,
    outputSchema: VehicleSuggesterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      return { suggestions: [] };
    }
    return output;
  }
);
