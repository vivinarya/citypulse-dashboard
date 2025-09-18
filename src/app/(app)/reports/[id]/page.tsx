'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Tag,
  Building,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';

import { listenToReportById } from '@/lib/reports';
import type { Report } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UpdateStatus from '@/components/reports/update-status';
import AiActions from '@/components/reports/ai-actions';

export default function ReportDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (params.id) {
      const unsubscribe = listenToReportById(params.id, (reportData) => {
        setReport(reportData);
      });
      return () => unsubscribe();
    }
  }, [params.id]);

  if (!report) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-[3] space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-headline text-3xl">
                  Report #{report.id}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </div>
              <Badge
                variant={
                  report.status === 'Resolved'
                    ? 'success'
                    : report.status === 'In Progress'
                    ? 'warning'
                    : report.status === 'Rejected'
                    ? 'destructive'
                    : 'secondary'
                }
                className="text-sm"
              >
                {report.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(report.timestamp), 'PPP, p')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{report.location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{report.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{report.department}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Submitted Images</CardTitle>
          </CardHeader>
          <CardContent>
            {report.imageUrls && report.imageUrls.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.imageUrls
                  .filter((url) => url)
                  .map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] w-full overflow-hidden rounded-lg"
                    >
                      <Image
                        src={url}
                        alt={`Report image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No images were submitted with this report.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex-[2] space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Report</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateStatus report={report} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              AI Assistant
            </CardTitle>
            <CardDescription>
              Use AI to analyze and process this report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiActions report={report} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
