
import { config } from 'dotenv';
config();

import '@/ai/flows/medical-question-wolof.ts';
import '@/ai/flows/audio-medical-question.ts';
import '@/ai/flows/medical-question-french.ts';
import '@/ai/flows/medical-question-english.ts';
import '@/ai/flows/register-user-flow.ts';
import '@/ai/flows/search-external-doctors-flow.ts'; // Added new flow for external doctor search
import '@/ai/tools/doctor-search-tools.ts'; // Ensure tools are registered if needed by flows at startup
