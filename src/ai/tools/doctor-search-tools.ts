
'use server';
/**
 * @fileOverview Tools for doctor search functionalities.
 *
 * - searchExternalDoctorsTool - A tool to simulate searching for doctors via an external source (e.g., Google).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ExternalDoctorSearchInputSchema = z.object({
  specialty: z.string().optional().describe('The specialty to search for.'),
  location: z.string().optional().describe('The location to search within (e.g., city, address).'),
  language: z.string().optional().describe('The language preference for the doctor.'),
  latitude: z.number().optional().describe("User's current latitude for 'near me' searches."),
  longitude: z.number().optional().describe("User's current longitude for 'near me' searches."),
  radiusKm: z.number().optional().describe("Search radius in kilometers for 'near me' or location-based searches."),
});
export type ExternalDoctorSearchInput = z.infer<typeof ExternalDoctorSearchInputSchema>;

export const ExternalDoctorProfileSchema = z.object({
  id: z.string().describe('A unique identifier for the external doctor.'),
  name: z.string().describe('The name of the doctor.'),
  specialty: z.string().optional().describe('The doctor\'s specialty.'),
  location: z.string().optional().describe('The doctor\'s location (can be general like city or specific address).'),
  languages: z.array(z.string()).optional().describe('Languages spoken by the doctor.'),
  source: z.literal('external').describe('Indicates the doctor was found via an external search.'),
  externalProfileUrl: z.string().url().optional().describe('A URL to an external profile or search result.'),
  inviteStatus: z.enum(['not_invited', 'invited']).default('not_invited').describe('Status of invitation to the network.')
});
export type ExternalDoctorProfile = z.infer<typeof ExternalDoctorProfileSchema>;

export const ExternalDoctorSearchOutputSchema = z.array(ExternalDoctorProfileSchema);
export type ExternalDoctorSearchOutput = z.infer<typeof ExternalDoctorSearchOutputSchema>;

// Mock implementation of an external doctor search tool
export const searchExternalDoctorsTool = ai.defineTool(
  {
    name: 'searchExternalDoctorsTool',
    description: 'Simulates searching for doctors on an external platform (e.g., Google) based on criteria including optional geolocation and radius, and returns a list of potential doctors not in our network.',
    inputSchema: ExternalDoctorSearchInputSchema,
    outputSchema: ExternalDoctorSearchOutputSchema,
  },
  async (input) => {
    console.log('searchExternalDoctorsTool called with input:', input);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let doctorLocation = input.location || "Various Locations";
    if (input.latitude && input.longitude) {
        doctorLocation = `Near (${input.latitude.toFixed(2)}, ${input.longitude.toFixed(2)})${input.radiusKm ? ` within ${input.radiusKm}km` : ''}`;
    }

    // Mocked results - in a real scenario, this would involve calling Google Search API or similar
    // and performing actual geocoding and distance filtering if coordinates/radius are provided.
    const mockExternalDoctors: ExternalDoctorProfile[] = [
      {
        id: "ext_doc_geo_1",
        name: `Dr. ${input.specialty || 'Nearby Generalist'} (${input.language || 'Any Lang'})`,
        specialty: input.specialty || "General Medicine",
        location: doctorLocation,
        languages: input.language ? [input.language, "English"] : ["English", "Spanish", "Wolof"],
        source: "external",
        externalProfileUrl: `https://www.google.com/search?q=doctor+${input.specialty}+${input.location || 'near me'}`,
        inviteStatus: 'not_invited',
      },
      {
        id: "ext_doc_geo_2",
        name: "Dr. Global Searcher (Remote Consult)",
        specialty: "Pediatrics",
        location: "Online / Global",
        languages: ["French", "German", "English"],
        source: "external",
        externalProfileUrl: "https://www.google.com/search?q=pediatrician+online",
        inviteStatus: 'not_invited',
      },
       {
        id: "ext_doc_specific_1",
        name: `Dr. Specific Location (${input.location || 'City Center'})`,
        specialty: input.specialty || "Internal Medicine",
        location: input.location || "City Center",
        languages: ["English"],
        source: "external",
        externalProfileUrl: `https://www.google.com/search?q=doctor+${input.specialty}+${input.location}`,
        inviteStatus: 'not_invited',
      }
    ];
    
    // Filter mock results slightly based on input to make it seem more real
    let results = mockExternalDoctors;
    if (input.specialty) {
        results = results.filter(doc => doc.specialty?.toLowerCase().includes(input.specialty!.toLowerCase()));
    }
    if (input.language) {
        results = results.filter(doc => doc.languages?.map(l => l.toLowerCase()).includes(input.language!.toLowerCase()));
    }
    
    // If no specific filters matched, return a generic set, otherwise the filtered ones.
    // Prioritize results that might conceptually match location input if provided.
    if (input.latitude && input.longitude) {
        return [mockExternalDoctors[0], mockExternalDoctors[1]].slice(0,2); // simulate geo-match
    } else if (input.location) {
         return [mockExternalDoctors[2], mockExternalDoctors[0]].slice(0,2); // simulate location text match
    }

    return results.length > 0 ? results.slice(0, 2) : mockExternalDoctors.slice(0,1); // Return a limited number of results
  }
);

```