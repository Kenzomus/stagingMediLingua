// 'use server'
'use server';
/**
 * @fileOverview A medical question answering AI agent for English speakers.
 *
 * - medicalQuestionEnglish - A function that handles medical questions in English.
 * - MedicalQuestionEnglishInput - The input type for the medicalQuestionEnglish function.
 * - MedicalQuestionEnglishOutput - The return type for the medicalQuestionEnglish function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalQuestionEnglishInputSchema = z.object({
  question: z.string().describe('The medical question in English.'),
});
export type MedicalQuestionEnglishInput = z.infer<typeof MedicalQuestionEnglishInputSchema>;

const MedicalQuestionEnglishOutputSchema = z.object({
  answer: z.string().describe('The answer to the medical question in English.'),
});
export type MedicalQuestionEnglishOutput = z.infer<typeof MedicalQuestionEnglishOutputSchema>;

export async function medicalQuestionEnglish(input: MedicalQuestionEnglishInput): Promise<MedicalQuestionEnglishOutput> {
  return medicalQuestionEnglishFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicalQuestionEnglishPrompt',
  input: {schema: MedicalQuestionEnglishInputSchema},
  output: {schema: MedicalQuestionEnglishOutputSchema},
  prompt: `You are a helpful AI assistant that answers medical questions in English. Please answer the following question accurately and provide helpful information.\n\nQuestion: {{{question}}}`,
});

const medicalQuestionEnglishFlow = ai.defineFlow(
  {
    name: 'medicalQuestionEnglishFlow',
    inputSchema: MedicalQuestionEnglishInputSchema,
    outputSchema: MedicalQuestionEnglishOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
