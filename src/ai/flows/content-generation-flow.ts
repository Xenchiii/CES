'use server';
/**
 * @fileOverview AI flow for generating website content (e.g., news, descriptions).
 * Intended for use by administrators.
 *
 * - generateContent - Function to generate content based on a topic/prompt.
 * - GenerateContentInput - Input type for generateContent.
 * - GenerateContentOutput - Output type for generateContent.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Define input schema
const GenerateContentInputSchema = z.object({
  contentType: z.enum(['news_article', 'event_description', 'sub_org_description', 'other'])
    .describe('The type of content to generate.'),
  topic: z.string().describe('The main subject or event for the content.'),
  keyPoints: z.array(z.string()).optional().describe('Optional bullet points or key information to include.'),
  tone: z.enum(['formal', 'informal', 'engaging', 'informative']).default('informative')
    .describe('The desired tone of the generated content.'),
  length: z.enum(['short', 'medium', 'long']).default('medium')
    .describe('Approximate desired length of the content.'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

// Define output schema
const GenerateContentOutputSchema = z.object({
  generatedContent: z.string().describe('The AI-generated content.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

// Define the prompt
const contentGenerationPrompt = ai.definePrompt({
  name: 'contentGenerationPrompt',
  input: {
    schema: GenerateContentInputSchema,
  },
  output: {
    schema: GenerateContentOutputSchema,
  },
  prompt: `You are an AI assistant helping administrators of the ICCT Colleges Computer Explorer Society (CES) - Antipolo Campus website generate content. Your task is to create well-written content based on the provided details.

Content Type: {{contentType}}
Topic/Event: {{{topic}}}
Desired Tone: {{tone}}
Desired Length: {{length}}

{{#if keyPoints}}
Key Points to Include:
{{#each keyPoints}}
- {{{this}}}
{{/each}}
{{/if}}

Instructions:
- Generate content suitable for the specified Content Type.
- Adhere to the desired Tone and Length.
- Incorporate all Key Points naturally, if provided.
- Ensure the content is relevant to a college computer science organization (CES Antipolo).
- For news/events, include relevant details like dates, times, locations if implied by the topic or key points.
- Output *only* the generated content text. Do not include preamble or explanation.

Generated Content:
`,
});

// Define the flow
const generateContentFlowInternal = ai.defineFlow<
  typeof GenerateContentInputSchema,
  typeof GenerateContentOutputSchema
>(
  {
    name: 'generateContentFlowInternal',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    console.log('Content generation flow received input:', input);
    try {
       if (typeof contentGenerationPrompt !== 'function') {
           console.error('CRITICAL: contentGenerationPrompt is not a function!');
           throw new Error('Internal configuration error.');
       }

      const result = await contentGenerationPrompt(input);

      if (!result || !result.output || typeof result.output.generatedContent !== 'string') {
          console.error('Content generation prompt returned unexpected output:', result);
          throw new Error('Failed to generate valid content.');
      }

      console.log('Content generation flow generated output.'); // Don't log full content for brevity
      return { generatedContent: result.output.generatedContent.trim() }; // Trim whitespace

    } catch (promptError) {
        console.error("Error during contentGenerationPrompt execution:", promptError);
        throw new Error("AI encountered an issue generating content.");
    }
  }
);

// Exported wrapper function
export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
    // Add validation or authorization checks here if needed
    // Example: Check if the user making the request has admin privileges
    // if (!isAdminUser(currentUser)) {
    //     throw new Error("Unauthorized: Only admins can generate content.");
    // }

    try {
        if (!input.topic || input.topic.trim().length === 0) {
            return { generatedContent: "Please provide a topic." };
        }
        return await generateContentFlowInternal(input);
    } catch (error) {
        console.error("Error in generateContent flow:", error);
        const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
        return { generatedContent: `Content generation failed: ${errorMessage}` };
    }
}
