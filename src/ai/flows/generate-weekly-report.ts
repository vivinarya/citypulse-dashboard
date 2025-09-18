'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReportInfoSchema = z.object({
  category: z.string(),
  status: z.string(),
  description: z.string(),
});

const GenerateWeeklyReportInputSchema = z.object({
  department: z.string().describe('The department for which to generate the report.'),
  reports: z.array(ReportInfoSchema).describe('A list of unresolved reports (Submitted or In Progress).'),
});

export type GenerateWeeklyReportInput = z.infer<
  typeof GenerateWeeklyReportInputSchema
>;

const GenerateWeeklyReportOutputSchema = z.object({
  report: z.string().describe('The generated weekly summary report in Markdown format.'),
});

export type GenerateWeeklyReportOutput = z.infer<
  typeof GenerateWeeklyReportOutputSchema
>;

export async function generateWeeklyReport(
  input: GenerateWeeklyReportInput
): Promise<GenerateWeeklyReportOutput> {
  return generateWeeklyReportFlow(input);
}

const generateWeeklyReportPrompt = ai.definePrompt({
  name: 'generateWeeklyReportPrompt',
  input: {schema: GenerateWeeklyReportInputSchema},
  output: {schema: GenerateWeeklyReportOutputSchema},
  prompt: `You are a municipal operations analyst for the city. Your task is to generate a concise weekly summary report for the head of the '{{{department}}}' department.

You have been provided with a list of all unresolved issues (status "Submitted" or "In Progress").

Analyze the provided list of reports and generate a summary in Markdown format.

The report should include:
1.  A brief, high-level overview of the current situation (total number of unresolved reports).
2.  A breakdown of unresolved issues by category, including the count for each category.
3.  A detailed list of all the reports provided.

Here is the list of unresolved reports:
{{#each reports}}
- **Category:** {{{this.category}}}
  - **Status:** {{{this.status}}}
  - **Description:** "{{{this.description}}}"
{{/each}}

Please structure your response clearly and professionally. Do not include a "Key Insights" section.
`,
});

const generateWeeklyReportFlow = ai.defineFlow(
  {
    name: 'generateWeeklyReportFlow',
    inputSchema: GenerateWeeklyReportInputSchema,
    outputSchema: GenerateWeeklyReportOutputSchema,
  },
  async input => {
    if (input.reports.length === 0) {
      return { report: 'No unresolved reports for this department. Great job!' };
    }
    const {output} = await generateWeeklyReportPrompt(input);
    return output!;
  }
);
