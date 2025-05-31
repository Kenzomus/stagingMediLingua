'use server';
/**
 * @fileOverview An AI agent to answer medical questions in Wolof.
 *
 * - answerMedicalQuestionWolof - A function that handles the medical question answering process in Wolof.
 * - AnswerMedicalQuestionWolofInput - The input type for the answerMedicalQuestionWolof function.
 * - AnswerMedicalQuestionWolofOutput - The return type for the answerMedicalQuestionWolof function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerMedicalQuestionWolofInputSchema = z.object({
  question: z.string().describe('The medical question asked in Wolof.'),
});
export type AnswerMedicalQuestionWolofInput = z.infer<typeof AnswerMedicalQuestionWolofInputSchema>;

const AnswerMedicalQuestionWolofOutputSchema = z.object({
  answer: z.string().describe('The answer to the medical question in Wolof.'),
});
export type AnswerMedicalQuestionWolofOutput = z.infer<typeof AnswerMedicalQuestionWolofOutputSchema>;

export async function answerMedicalQuestionWolof(input: AnswerMedicalQuestionWolofInput): Promise<AnswerMedicalQuestionWolofOutput> {
  return answerMedicalQuestionWolofFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerMedicalQuestionWolofPrompt',
  input: {schema: AnswerMedicalQuestionWolofInputSchema},
  output: {schema: AnswerMedicalQuestionWolofOutputSchema},
  prompt: `You are a helpful AI assistant specializing in providing medical information in Wolof.
  Answer the following medical question in Wolof:\n\n  {{question}}`,
});

const answerMedicalQuestionWolofFlow = ai.defineFlow(
  {
    name: 'answerMedicalQuestionWolofFlow',
    inputSchema: AnswerMedicalQuestionWolofInputSchema,
    outputSchema: AnswerMedicalQuestionWolofOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
