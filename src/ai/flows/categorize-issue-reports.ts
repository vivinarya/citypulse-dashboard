'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeIssueReportInputSchema = z.object({
  description: z.string().describe('The description of the issue report.'),
});
export type CategorizeIssueReportInput = z.infer<typeof CategorizeIssueReportInputSchema>;

const CategorizeIssueReportOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The category of the issue report (e.g., Pothole, Broken Streetlight, Sanitation).'
    ),
});
export type CategorizeIssueReportOutput = z.infer<typeof CategorizeIssueReportOutputSchema>;

export async function categorizeIssueReport(
  input: CategorizeIssueReportInput
): Promise<CategorizeIssueReportOutput> {
  return categorizeIssueReportFlow(input);
}

const categorizeIssueReportPrompt = ai.definePrompt({
  name: 'categorizeIssueReportPrompt',
  input: {schema: CategorizeIssueReportInputSchema},
  output: {schema: CategorizeIssueReportOutputSchema},
  prompt: `You are an expert city services issue categorizer.

  Given the following issue report description, determine the most appropriate category for the report.

  Description: {{{description}}}

  Respond with only the category name.  Valid categories include: "Pothole", "Broken Streetlight", "Sanitation", "Blocked Drain / Water Logging", "Road Obstruction", "Traffic Signal Issue", "Vandalism", "Other".`,
});

const categorizeIssueReportFlow = ai.defineFlow(
  {
    name: 'categorizeIssueReportFlow',
    inputSchema: CategorizeIssueReportInputSchema,
    outputSchema: CategorizeIssueReportOutputSchema,
  },
  async input => {
    const {output} = await categorizeIssueReportPrompt(input);
    return output!;
  }
);
