'use server';

import { revalidatePath } from 'next/cache';
import {
  categorizeIssueReport,
  type CategorizeIssueReportInput,
} from '@/ai/flows/categorize-issue-reports';
import {
  assignReportToDepartment,
  type AssignReportToDepartmentInput,
} from '@/ai/flows/assign-reports-to-departments';
import {
  generateWeeklyReport as generateWeeklyReportFlow,
  type GenerateWeeklyReportInput,
} from '@/ai/flows/generate-weekly-report';
import { updateReportStatus, getReportById } from '@/lib/reports';
import type { ReportStatus } from '@/lib/types';
import { differenceInDays } from 'date-fns';

export async function runCategorization(input: CategorizeIssueReportInput) {
  try {
    const result = await categorizeIssueReport(input);
    return result;
  } catch (error) {
    console.error('Error in runCategorization:', error);
    throw new Error('Failed to categorize issue.');
  }
}

export async function runDepartmentAssignment(
  input: AssignReportToDepartmentInput
) {
  try {
    const result = await assignReportToDepartment(input);
    return result;
  } catch (error) {
    console.error('Error in runDepartmentAssignment:', error);
    throw new Error('Failed to assign department.');
  }
}

export async function updateReportStatusAction(
  id: string,
  status: ReportStatus
) {
  try {
    let resolutionTime: number | undefined;
    const report = await getReportById(id);
    if (status === 'Resolved' && report?.timestamp) {
      resolutionTime = differenceInDays(new Date(), new Date(report.timestamp));
    }
    await updateReportStatus(id, status, resolutionTime);
    revalidatePath('/reports');
    revalidatePath(`/reports/${id}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to update status:', error);
    return { success: false, error: 'Could not update the report status.' };
  }
}

export async function generateWeeklyReport(input: GenerateWeeklyReportInput) {
  try {
    const result = await generateWeeklyReportFlow(input);
    return result;
  } catch (error) {
    console.error('Error in generateWeeklyReport:', error);
    throw new Error('Failed to generate weekly report.');
  }
}
