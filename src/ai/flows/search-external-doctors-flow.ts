
'use server';
/**
 * @fileOverview A Genkit flow to search for doctors externally.
 * This flow uses the searchExternalDoctorsTool to simulate finding doctors
 * outside the platform's network, potentially using geolocation data.
 *
 * - searchExternalDoctors - Function to trigger the external doctor search.
 * - SearchExternalDoctorsFlowInput - Input type for the flow.
 * - SearchExternalDoctorsFlowOutput - Output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  searchExternalDoctorsTool,
  ExternalDoctorSearchInputSchema, // Ensure this is imported for type consistency
  ExternalDoctorSearchOutputSchema,
  type ExternalDoctorSearchInput,
  type ExternalDoctorSearchOutput,
} from '@/ai/tools/doctor-search-tools';

// Re-exporting types for flow usage, based on the tool's schemas
export type SearchExternalDoctorsFlowInput = ExternalDoctorSearchInput;
export type SearchExternalDoctorsFlowOutput = ExternalDoctorSearchOutput;

export async function searchExternalDoctors(input: SearchExternalDoctorsFlowInput): Promise<SearchExternalDoctorsFlowOutput> {
  return searchExternalDoctorsFlow(input);
}

const searchExternalDoctorsFlow = ai.defineFlow(
  {
    name: 'searchExternalDoctorsFlow',
    inputSchema: ExternalDoctorSearchInputSchema, // Use the schema from the tool
    outputSchema: ExternalDoctorSearchOutputSchema, // Use the schema from the tool
  },
  async (input) => {
    // In a more complex scenario, you might have multiple tools or steps.
    // For now, we directly use the searchExternalDoctorsTool.
    console.log("searchExternalDoctorsFlow called with input:", input);
    const externalDoctors = await searchExternalDoctorsTool(input);
    return externalDoctors;
  }
);

```