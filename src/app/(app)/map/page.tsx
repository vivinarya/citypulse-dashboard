
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapIcon } from 'lucide-react';
import DashboardFilter from '@/components/dashboard/dashboard-filter';
import GoogleMapLoader from '@/components/map/google-map-loader';
import { listenToReports } from '@/lib/reports';
import type { Report } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function MapPage() {
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
      (!category || report.category === category) &&
      (!department || report.department === department) &&
      (!description ||
        report.description.toLowerCase().includes(description.toLowerCase()))
    );
  });

  const departments = [...new Set(allReports.map((r) => r.department))].filter(Boolean) as string[];
  const categories = [...new Set(allReports.map((r) => r.category))].filter(Boolean) as string[];
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DashboardFilter departments={departments} categories={categories} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-6 w-6" />
            Live Issue Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[600px] w-full bg-muted rounded-lg overflow-hidden border">
            <GoogleMapLoader reports={filteredReports} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
