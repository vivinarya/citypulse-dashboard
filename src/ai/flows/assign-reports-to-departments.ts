'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssignReportToDepartmentInputSchema = z.object({
  category: z.string().describe('The category of the issue report.'),
  description: z.string().describe('The description of the issue report.'),
  location: z.string().describe('The location of the issue report.'),
});

export type AssignReportToDepartmentInput = z.infer<
  typeof AssignReportToDepartmentInputSchema
>;

const AssignReportToDepartmentOutputSchema = z.object({
  department: z.string().describe('The city department assigned to the report.'),
  reason: z.string().describe('The reason for assigning the report to the department.'),
});

export type AssignReportToDepartmentOutput = z.infer<
  typeof AssignReportToDepartmentOutputSchema
>;

export async function assignReportToDepartment(
  input: AssignReportToDepartmentInput
): Promise<AssignReportToDepartmentOutput> {
  return assignReportToDepartmentFlow(input);
}

const assignReportToDepartmentPrompt = ai.definePrompt({
  name: 'assignReportToDepartmentPrompt',
  input: {schema: AssignReportToDepartmentInputSchema},
  output: {schema: AssignReportToDepartmentOutputSchema},
  prompt: `You are an expert in urban issue management and city department operations.
  Given the category, description, and location of an issue report, determine the most relevant city department to handle the issue.

  Category: {{{category}}}
  Description: {{{description}}}
  Location: {{{location}}}

  Consider factors such as the type of issue, the department's area of responsibility, and the location of the issue.
  Provide the name of the department and a brief explanation of why that department is best suited to handle the issue.
  Format your response as a JSON object with "department" and "reason" fields.
  `,
});

const assignReportToDepartmentFlow = ai.defineFlow(
  {
    name: 'assignReportToDepartmentFlow',
    inputSchema: AssignReportToDepartmentInputSchema,
    outputSchema: AssignReportToDepartmentOutputSchema,
  },
  async input => {
    const {output} = await assignReportToDepartmentPrompt(input);
    return output!;
  }
);
