
'use server';
/**
 * @fileOverview AI companion flow for Sparrow.
 * Includes AI-powered tutoring, task assistance, personalized recommendations,
 * and contextual help based on website content.
 *
 * - sparrowFlow - A function that handles user interaction with Sparrow.
 * - SparrowInput - The input type for the sparrowFlow function.
 * - SparrowOutput - The return type for the sparrowFlow function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Define input schema (remains the same)
const SparrowInputSchema = z.object({
  query: z.string().describe('The user question or statement directed to Sparrow.'),
  currentPage: z.string().optional().describe('The current page the user is on (e.g., "/", "/about", "/events").'),
  userProfile: z.object({ // Basic user profile for personalization (optional)
        name: z.string().optional(),
        interests: z.array(z.string()).optional(), // e.g., ['AI', 'Web Dev']
        subOrgMembership: z.string().optional(), // e.g., 'ai-mentors'
    }).optional().describe('Basic user profile information for personalized responses.'),
  // Add chat history later if needed for context
});
export type SparrowInput = z.infer<typeof SparrowInputSchema>;

// Define a schema for the data *actually* passed to the prompt template
// including the pre-processed interests string
const SparrowPromptInputSchema = SparrowInputSchema.extend({
    userInterestsString: z.string().optional().describe('Comma-separated string of user interests.'),
});

// Define output schema (structured output the *flow* returns)
const SparrowOutputSchema = z.object({
  response: z.string().describe("Sparrow's response to the user."),
   suggestedAction: z.object({ // Optional suggestion
        label: z.string(),
        url: z.string().optional(), // URL for navigation
        query: z.string().optional(), // Suggested follow-up query
   }).nullable().optional().describe("A suggested follow-up action or link."), // Allow null
});
export type SparrowOutput = z.infer<typeof SparrowOutputSchema>;

// Define a simpler prompt output schema (just text for the LLM to generate)
const SparrowPromptOutputSchema = z.object({
    response: z.string().describe("Sparrow's full text response, potentially including a suggestion on a new line."),
});

// Define the prompt with text output instructions
const sparrowPrompt = ai.definePrompt({
  name: 'sparrowPrompt',
  input: {
    schema: SparrowPromptInputSchema, // Use the extended schema with the interests string
  },
  output: {
    // The prompt *itself* only aims to generate a string now
    schema: SparrowPromptOutputSchema,
  },
  prompt: `You are Sparrow, a friendly and helpful AI companion for the ICCT Colleges Computer Explorer Society (CES) - Antipolo Campus website. This website was created by Prince Cartoja. Your primary role is to assist users, particularly students, in navigating the site and finding information about CES, its events, achievements, sub-organizations, membership, leadership, and available resources. You can also provide contextual help, personalized recommendations, basic tutoring on CS topics relevant to CES, and assist with simple tasks like finding information. You are fully aware of all the content on the website and the key personnel involved.

**Website Content Overview:**

*   **Home (/)**: Main landing page with news and upcoming events. Creator: Prince Cartoja.
*   **Events (/events)**: Detailed event calendar. Key events: Prelims (May 4-7), Midterms (June 5-8), CCS Day (June 13-14 @ ICCT Cainta), Sports Festival (June 20 @ Marikina Sports Center), Finals (June 26-29), Arduino Seminar (June 6).
*   **Achievements (/achievements)**: Showcases member/sub-org accomplishments (e.g., contest wins).
*   **Sub-orgs (/sub-orgs)**: Overview of specialized groups (AI Mentors, Algorithm Knights, Code Warriors, Cybernet Rangers, Digital Expressionists, GHZ Builders, Mobile Mnemonics, Web Arachnids) with links to detail pages.
*   **Membership (/membership)**: Info on joining CES (₱20), ICSO (₱20), Sub-orgs (₱15). Includes application form (Email, Phone, Section, Student ID) and GCash payment process.
*   **About (/about)**: Mission, history (est. ~2010), lists officers and developer team (Prince Cartoja - creator).
*   **Contact (/contact)**: Contact form and details (J. Sumulong St, Antipolo; computerexplorer.antipolo@gmail.com; FB: /ices.antipolochapter).
*   **Profile (/profile)**: (Sidebar access) View/edit user info (Name, Year, Course, Section, DOB, Student ID, Email).
*   **Forums (/forums)**: Discussion boards for Homework Help, Class Discussions, Announcements, Resources, etc.
*   **Alumni (/alumni)**: Alumni network with directory, news, events.
*   **Admin (/admin)**: Admin dashboard (user not directly accessing). Includes content management (news, events, achievements), user/role management, membership review, finance, sub-org details, analytics, and planned tools like CMS, Event Reg, Reporting, Email System, RBAC.

**Key Personnel:**

*   **CES Officers**: Pres. Lian Mae Pantaleon, VP Cyril John Noynay, Sec. Willie John Icaro, Asst. Sec. Ma. Gheleen Malabanan, Treas. Mary Yovhel Gamas, Auditor Amalia Angela Remiendo, PM Reiner Felias, Asst. PMs Venice Margarette Niebres & Princess Khazanabelle Cartoja, SMM Gemica May Rivera.
*   **Developer Team**: Lead/Creator Prince Cartoja; Seniors Jeremiah Rey & Romano Ycoy; Juniors Ronald Christopher Zapanta, Sairon Akir Nacionales, Leonce Ganancios, Kristine Mae Sacariz, Glenmar Agosto.
*   **ICSO Officers**: Pres. Diana Rose Joven, VP Mark Vince Catabuena, Sec. Rica Mae Arellano, Treas. Jordan Panganiban, Auditor Mary John Buluran, PRO Rodel Adrian Romana, SMM Frederick Carigma.
*   **Sub-Org Leaders**: AI Mentors: Cpt. Frederick Carigma; Algorithm Knights: Cpt. Amalia Angela Remiendo, Cmdr. Ma. Gheleen Malabanan; Code Warriors: Cpt. Ronald Christopher Zapanta, Cmdr. Rafael Baluyot; Digital Expressionists: Cpt. Diana Rose Joven, Cmdr. Mark Vince Catabuena; GHZ Builders: Cpt. Princess Khazanabelle Cartoja, Cmdr. Rodel Adrian Romana; Web Arachnids: Cpt. Rica Mae Arellano, Cmdr. Jordan Panganiban; (Cybernet Rangers/Mobile Mnemonics leaders TBD).

**Your Capabilities & Task:**

1.  **Answer Questions**: Use website content/personnel info. Mention Prince Cartoja if asked about website creation.
2.  **Guide Navigation**: Direct users to relevant pages (e.g., "Find membership details on the /membership page."). Provide a suggestion with a relevant URL if appropriate.
3.  **Contextual Help**: {{#if currentPage}}User is on {{currentPage}}. {{/if}}Tailor response.
4.  **Personalized Recommendations**: {{#if userProfile}}User: {{userProfile.name}}. Interests: {{#if userInterestsString}}{{{userInterestsString}}}{{else}}None specified{{/if}}. Member of: {{userProfile.subOrgMembership}}{{else}}User profile not provided.{{/if}} Use profile info for suggestions if asked (e.g., recommend events/sub-orgs). Suggest a specific event, sub-org, or forum category. Include this as a suggestion if possible.
5.  **Basic Tutoring & Guidance**: Explain CS concepts related to sub-orgs (AI, algorithms, web dev, etc.). Point to resources like /forums. Do *not* give full solutions.
6.  **Task Assistance**: Help find info (e.g., contact email, next event). Explain inability to perform external actions (scheduling), but provide contact info.
7.  **Be Concise and Friendly**: Use Markdown for formatting.
8.  **Suggest Next Steps**: If appropriate, add a suggestion *after* the main response on a *new line* starting exactly with "Suggestion: ". Format it like: \`Suggestion: [Label] (URL: [/path/to/page])\` or \`Suggestion: [Label] (QUERY: [follow-up question])\`. Only include one suggestion if relevant. Ensure there is only *one* line starting with "Suggestion: ".
9.  **Stay On Topic**: Politely decline unrelated requests. State your purpose: "I can assist with information about the ICCT CES Antipolo website, its activities, related CS topics, and the people involved."

**User Query:** {{{query}}}

**Respond as Sparrow:**
`,
});

// Define the flow (renamed internal flow)
const sparrowFlowHandler = ai.defineFlow<
  typeof SparrowInputSchema, // Flow still takes the original input
  typeof SparrowOutputSchema // Flow still returns the structured output
>(
  {
    name: 'sparrowFlowHandler', // Renamed internal flow
    inputSchema: SparrowInputSchema,
    outputSchema: SparrowOutputSchema,
  },
  async (input): Promise<SparrowOutput> => { // Explicitly type the return promise
    console.log('Sparrow flow handler received input:', JSON.stringify(input, null, 2));

    // Pre-process interests into a string
    const userInterestsString = input.userProfile?.interests?.join(', ') || undefined;

    // Create the input object for the prompt, including the pre-processed string
    const promptInput = {
        ...input,
        userInterestsString,
    };

    try {
       if (typeof sparrowPrompt !== 'function') {
           console.error('CRITICAL: sparrowPrompt is not a function!');
           throw new Error('Internal configuration error.');
       }

       console.log('Calling sparrowPrompt with processed input:', JSON.stringify(promptInput, null, 2));
      // Call the prompt with the processed input
      const result = await sparrowPrompt(promptInput);
      console.log('Sparrow prompt raw result:', JSON.stringify(result, null, 2)); // Log the full raw result

      // Check if we got *any* text output
      const rawOutput = result?.output?.response;
      if (!rawOutput || typeof rawOutput !== 'string') {
          console.error('Sparrow prompt returned unexpected or missing text output:', result);
          // If output is truly invalid, return a generic error.
          return { response: "Sorry, I had trouble understanding the AI's response format. Please try again." };
      }

      console.log('Sparrow flow received raw output:', rawOutput); // Log raw output for debugging

      // Parse the raw output for the main response and the optional suggestion line
      const lines = rawOutput.trim().split('\n');
      let mainResponseLines: string[] = [];
      let suggestionLineText: string | null = null;
      let suggestedAction: SparrowOutput['suggestedAction'] = null;

      // Find the *first* line starting with "Suggestion: "
      for (let i = 0; i < lines.length; i++) {
        const trimmedLine = lines[i].trim();
        if (trimmedLine.startsWith('Suggestion: ') && suggestionLineText === null) { // Only capture the first suggestion line found
            suggestionLineText = trimmedLine.substring('Suggestion: '.length).trim();
        } else {
            mainResponseLines.push(lines[i]); // Add non-suggestion lines to main response
        }
      }

      const mainResponse = mainResponseLines.join('\n').trim();

      if (suggestionLineText) {
        console.log("Found suggestion line:", suggestionLineText);
        // Try to parse suggestion format: Label (URL: /path) or Label (QUERY: text)
        const urlMatch = suggestionLineText.match(/^(.*)\(URL:\s*(.*)\)$/);
        const queryMatch = suggestionLineText.match(/^(.*)\(QUERY:\s*(.*)\)$/);

        if (urlMatch && urlMatch.length === 3) {
          suggestedAction = { label: urlMatch[1].trim(), url: urlMatch[2].trim() };
        } else if (queryMatch && queryMatch.length === 3) {
          suggestedAction = { label: queryMatch[1].trim(), query: queryMatch[2].trim() };
        } else {
            // If format doesn't match, log a warning but potentially still use the text as a label.
            console.warn("Could not parse suggestion format:", suggestionLineText);
            // For now, let's ignore suggestions that don't match the format strictly.
            // suggestedAction = { label: suggestionLineText }; // Optionally treat as label only
        }
      }

       // Ensure mainResponse is not empty after parsing
       if (!mainResponse) {
            // This shouldn't happen if rawOutput was valid, but as a fallback:
            console.error("LLM output parsing resulted in empty main response. Raw output:", rawOutput);
            return { response: "I seem to have lost my train of thought. Could you ask again?" };
       }

      console.log('Sparrow flow parsed output:', JSON.stringify({ response: mainResponse, suggestedAction }, null, 2));
      return { response: mainResponse, suggestedAction: suggestedAction };

    } catch (promptError) {
        // Enhanced logging for prompt execution errors
        console.error("Error during sparrowPrompt execution or parsing:", JSON.stringify(promptError, Object.getOwnPropertyNames(promptError)));
        console.error("Input causing error:", JSON.stringify(promptInput)); // Log the processed input
        // Return a more specific error if possible, otherwise the generic one
        const errorMessage = (promptError instanceof Error) ? promptError.message : "An unknown error occurred.";
        return { response: `Sorry, I encountered an issue processing that request. (${errorMessage.substring(0, 50)}${errorMessage.length > 50 ? '...' : ''}) Please try again.` };
    }
  }
);

// Exported wrapper function
export async function sparrowFlow(input: SparrowInput): Promise<SparrowOutput> {
    try {
        if (!input.query || typeof input.query !== 'string' || input.query.trim().length === 0) {
            return { response: "Please provide a query." };
        }
        // Add validation for other fields if necessary
        if (input.currentPage && typeof input.currentPage !== 'string') {
            console.warn('Invalid currentPage format received:', input.currentPage);
            input.currentPage = undefined; // Sanitize input
        }
        // Add more validation for userProfile if needed

        return await sparrowFlowHandler(input); // Call the renamed internal flow
    } catch (error) {
        console.error("Error in sparrowFlow (wrapper):", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        // This catches errors *before* or *after* the sparrowFlowHandler runs.
        return { response: "Sorry, I couldn't process your request right now. An unexpected error occurred." };
    }
}

    