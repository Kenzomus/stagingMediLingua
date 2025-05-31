'use server';
/**
 * @fileOverview A flow that takes audio input, transcribes it, and answers the medical question.
 *
 * - audioMedicalQuestion - A function that handles the audio transcription and question answering.
 * - AudioMedicalQuestionInput - The input type for the audioMedicalQuestion function.
 * - AudioMedicalQuestionOutput - The return type for the audioMedicalQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AudioMedicalQuestionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data URI containing the user's medical question.  It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AudioMedicalQuestionInput = z.infer<typeof AudioMedicalQuestionInputSchema>;

const AudioMedicalQuestionOutputSchema = z.object({
  transcription: z.string().describe('The transcription of the audio input.'),
  answer: z.string().describe('The answer to the medical question.'),
});
export type AudioMedicalQuestionOutput = z.infer<typeof AudioMedicalQuestionOutputSchema>;

export async function audioMedicalQuestion(input: AudioMedicalQuestionInput): Promise<AudioMedicalQuestionOutput> {
  return audioMedicalQuestionFlow(input);
}

const transcribeAudioPrompt = ai.definePrompt({
  name: 'transcribeAudioPrompt',
  input: {schema: AudioMedicalQuestionInputSchema},
  output: {schema: z.object({transcription: z.string()})},
  prompt: `Transcribe the following audio recording of a medical question: {{media url=audioDataUri}}`,
});

const answerMedicalQuestionPrompt = ai.definePrompt({
  name: 'answerMedicalQuestionPrompt',
  input: {schema: z.object({question: z.string()})},
  output: {schema: z.object({answer: z.string()})},
  prompt: `Answer the following medical question: {{{question}}}`,
});

const audioMedicalQuestionFlow = ai.defineFlow(
  {
    name: 'audioMedicalQuestionFlow',
    inputSchema: AudioMedicalQuestionInputSchema,
    outputSchema: AudioMedicalQuestionOutputSchema,
  },
  async input => {
    const {output: transcriptionResult} = await transcribeAudioPrompt(input);
    const transcription = transcriptionResult!.transcription;

    const {output: answerResult} = await answerMedicalQuestionPrompt({question: transcription});
    const answer = answerResult!.answer;

    return {transcription, answer};
  }
);
