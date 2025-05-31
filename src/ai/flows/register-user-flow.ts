
'use server';
/**
 * @fileOverview A Genkit flow to handle user registration.
 * This flow simulates user registration. In a real application,
 * this is where you would integrate with Firebase Authentication (to create the user)
 * and Firestore (to save additional user profile data).
 *
 * - registerUser - A function that handles the user registration process.
 * - RegisterUserInput - The input type for the registerUser function.
 * - RegisterUserOutput - The return type for the registerUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegisterUserInputSchema = z.object({
  firstName: z.string().describe('User first name'),
  lastName: z.string().describe('User last name'),
  email: z.string().email().describe('User email address'),
  password: z.string().describe('User password (should be hashed before storing)'), // In a real app, never log/store plain passwords
  accountType: z.enum(['patient', 'doctor']).describe('Type of account to create'),
});
export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;

const RegisterUserOutputSchema = z.object({
  success: z.boolean().describe('Whether the registration was successful.'),
  message: z.string().optional().describe('A message regarding the registration outcome.'),
  userId: z.string().optional().describe('The ID of the newly created user (if successful).'),
});
export type RegisterUserOutput = z.infer<typeof RegisterUserOutputSchema>;

export async function registerUser(input: RegisterUserInput): Promise<RegisterUserOutput> {
  return registerUserFlow(input);
}

// This is a placeholder prompt. In a real scenario, you wouldn't use an LLM for core registration logic.
// Registration logic (Firebase Auth, DB writes) would be direct Typescript calls within the flow.
const registrationPrompt = ai.definePrompt({
    name: 'registrationPrompt',
    input: {schema: RegisterUserInputSchema},
    output: {schema: RegisterUserOutputSchema},
    prompt: `A user is trying to register with the following details:
    First Name: {{{firstName}}}
    Last Name: {{{lastName}}}
    Email: {{{email}}}
    Account Type: {{{accountType}}}
    
    Simulate a successful registration and provide a success message.
    If the email contains "testfail", simulate a failure.
    Do not mention the password.
    Output should be in the RegisterUserOutput schema format.
    Example successful output: { "success": true, "message": "User registered successfully!", "userId": "simulated-user-id-123" }
    Example failure output: { "success": false, "message": "This email is already taken (simulated)." }
    `,
});


const registerUserFlow = ai.defineFlow(
  {
    name: 'registerUserFlow',
    inputSchema: RegisterUserInputSchema,
    outputSchema: RegisterUserOutputSchema,
  },
  async (input: RegisterUserInput): Promise<RegisterUserOutput> => {
    console.log('Registering user (simulation):', input.email, input.accountType);

    // IMPORTANT: Actual Firebase/Database integration would go here.
    // 1. Firebase Authentication:
    //    Use Firebase Admin SDK (server-side) or Firebase client SDK (if handled differently)
    //    to create a new user with email and password.
    //    Example (conceptual, needs Firebase Admin SDK setup):
    //    try {
    //      const userRecord = await admin.auth().createUser({
    //        email: input.email,
    //        password: input.password, // Ensure this is handled securely
    //        displayName: `${input.firstName} ${input.lastName}`,
    //      });
    //      const userId = userRecord.uid;
    //
    //      // 2. Firestore:
    //      //    Save additional user profile information to Firestore.
    //      await admin.firestore().collection('users').doc(userId).set({
    //        firstName: input.firstName,
    //        lastName: input.lastName,
    //        email: input.email,
    //        accountType: input.accountType,
    //        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    //      });
    //
    //      return { success: true, message: 'Registration successful!', userId };
    //    } catch (error: any) {
    //      console.error('Firebase Auth/Firestore error:', error);
    //      return { success: false, message: error.message || 'Registration failed.' };
    //    }
    
    // Simulating registration using the LLM prompt for now as a placeholder.
    // In a real app, you would NOT use an LLM for this core logic.
    if (input.email.includes("testfail")) {
        return { success: false, message: 'This email is already taken (simulated for testfail@).', userId: undefined };
    }
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demonstration, we'll return a simulated success response.
    // In a real application, this part is critical and involves secure handling of user data.
    const simulatedUserId = `simulated-${input.accountType}-${Date.now()}`;
    return {
      success: true,
      message: `User ${input.firstName} registered successfully as a ${input.accountType} (simulation).`,
      userId: simulatedUserId,
    };
  }
);
