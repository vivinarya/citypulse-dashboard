
'use client';

import { useState, useEffect } from 'react';
import StatsCards from '@/components/dashboard/stats-cards';
import DepartmentChart from '@/components/dashboard/department-chart';
import StatusChart from '@/components/dashboard/status-chart';
import RecentReportsCard from '@/components/dashboard/recent-reports-card';
import { listenToReports } from '@/lib/reports';
import type { Report } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = listenToReports((reports) => {
      setAllReports(reports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const category = searchParams.get('category');
  const department = searchParams.get('department');
  const description = searchParams.get('description');

  const filteredReports = allReports.filter((report) => {
    return (
      (!category ||
        report.category.toLowerCase().includes(category.toLowerCase())) &&
      (!department ||
        (report.department && report.department.toLowerCase().includes(department.toLowerCase()))) &&
      (!description ||
        report.description.toLowerCase().includes(description.toLowerCase()))
    );
  });

  const reports = filteredReports;

  const totalReports = reports.length;
  const resolvedReports = reports.filter(
    (report) => report.status === 'Resolved'
  ).length;
  const pendingReports = reports.filter(
    (report) => report.status === 'Submitted' || report.status === 'In Progress'
  ).length;
  const averageResolutionTime =
    reports
      .filter((r) => r.resolutionTime)
      .reduce((acc, r) => acc + r.resolutionTime!, 0) /
      reports.filter((r) => r.resolutionTime).length || 0;

  const stats = {
    totalReports,
    resolvedReports,
    pendingReports,
    averageResolutionTime: averageResolutionTime.toFixed(1),
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <StatsCards stats={stats} />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <DepartmentChart data={reports} />
              <StatusChart data={reports} />
            </div>
          </div>
          <RecentReportsCard reports={reports} />
        </div>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
