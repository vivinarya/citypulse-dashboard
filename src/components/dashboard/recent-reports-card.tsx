import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Report } from '@/lib/types';
import Link from 'next/link';
import { ArrowUpRight, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type RecentReportsCardProps = {
  reports: Report[];
};

export default function RecentReportsCard({ reports }: RecentReportsCardProps) {
  const recentReports = [...reports]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <Card className="xl:col-span-1">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            The latest issues submitted by citizens.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/reports">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recentReports.map((report) => (
          <div key={report.id} className="flex items-start gap-4">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <div className="grid flex-1 gap-1">
              <p className="text-sm font-medium leading-none">
                {report.category}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {report.description}
              </p>
            </div>
            <div className="ml-auto flex-shrink-0 text-sm text-muted-foreground text-right space-y-1">
              <div className="whitespace-nowrap">
                {report.timestamp
                  ? formatDistanceToNow(new Date(report.timestamp), {
                      addSuffix: true,
                    })
                  : ''}
              </div>
              <div className="flex justify-end">
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
                >
                  {report.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
