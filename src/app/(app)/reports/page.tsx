
'use client';

import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/reports/data-table';
import { columns } from '@/components/reports/columns';
import { listenToReports } from '@/lib/reports';
import type { Report } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import DashboardFilter from '@/components/dashboard/dashboard-filter';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { generateWeeklyReport } from '@/app/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = listenToReports((reports) => {
      setAllReports(reports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const descriptionFilter = searchParams.get('description');
  const categoryFilter = searchParams.get('category');
  const departmentFilter = searchParams.get('department');

  const filteredReports = useMemo(() => {
    return allReports.filter((report) => {
      return (
        (!descriptionFilter ||
          report.description
            .toLowerCase()
            .includes(descriptionFilter.toLowerCase())) &&
        (!categoryFilter || report.category === categoryFilter) &&
        (!departmentFilter || report.department === departmentFilter)
      );
    });
  }, [allReports, descriptionFilter, categoryFilter, departmentFilter]);

  const handleGenerateReport = async () => {
    if (!departmentFilter) return;

    setIsGeneratingReport(true);
    try {
      const reportsToSummarize = filteredReports.filter(
        (r) => r.status === 'Submitted' || r.status === 'In Progress'
      );

      const input = {
        department: departmentFilter,
        reports: reportsToSummarize.map((r) => ({
          category: r.category,
          status: r.status,
          description: r.description,
        })),
      };

      const result = await generateWeeklyReport(input);
      setGeneratedReport(result.report);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description:
          'There was an error generating the weekly summary. Please try again.',
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const departments = [...new Set(allReports.map((r) => r.department))].filter(
    Boolean
  ) as string[];
  const categories = [...new Set(allReports.map((r) => r.category))].filter(
    Boolean
  ) as string[];

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Issue Reports
        </h1>
        <Skeleton className="h-14 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Issue Reports
        </h1>
        <Button
          onClick={handleGenerateReport}
          disabled={!departmentFilter || isGeneratingReport}
          className="gap-2"
        >
          {isGeneratingReport ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Generate Weekly Summary
        </Button>
      </div>
      <DashboardFilter departments={departments} categories={categories} />
      <DataTable columns={columns} data={filteredReports} />

      <AlertDialog
        open={!!generatedReport}
        onOpenChange={(open) => !open && setGeneratedReport(null)}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Weekly Summary for {departmentFilter}
            </AlertDialogTitle>
            <AlertDialogDescription>
              AI-generated summary of unresolved issues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto pr-4">
            <div dangerouslySetInnerHTML={{ __html: generatedReport ? new (require('showdown').Converter)().makeHtml(generatedReport) : '' }} />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
