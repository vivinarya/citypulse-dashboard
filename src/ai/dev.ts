import { config } from 'dotenv';
config();

import '@/ai/flows/assign-reports-to-departments.ts';
import '@/ai/flows/categorize-issue-reports.ts';
import '@/ai/flows/generate-weekly-report.ts';
