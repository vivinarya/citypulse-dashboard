'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import { useTransition } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Report } from '@/lib/types';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { updateReportStatusAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const StatusUpdateMenuItem = ({
  reportId,
  status,
}: {
  reportId: string;
  status: 'In Progress' | 'Resolved';
}) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleUpdate = () => {
    startTransition(async () => {
      const result = await updateReportStatusAction(reportId, status);
      if (result.success) {
        toast({
          title: 'Status Updated',
          description: `Report #${reportId} marked as ${status}.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.error,
        });
      }
    });
  };

  return (
    <DropdownMenuItem onClick={handleUpdate} disabled={isPending}>
      {status === 'In Progress' ? (
        <Clock className="mr-2 h-4 w-4" />
      ) : (
        <CheckCircle className="mr-2 h-4 w-4" />
      )}
      Mark as {status}
    </DropdownMenuItem>
  );
};

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return <div className="max-w-[300px] truncate">{description}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Report['status'];
      return (
        <Badge
          variant={
            status === 'Resolved'
              ? 'success'
              : status === 'In Progress'
              ? 'warning'
              : status === 'Rejected'
              ? 'destructive'
              : 'secondary'
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Submitted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.getValue('timestamp') as string;
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return <div className="font-medium">{format(date, 'MMM d, yyyy')}</div>;
    },
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const report = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/reports/${report.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <StatusUpdateMenuItem reportId={report.id} status="In Progress" />
            <StatusUpdateMenuItem reportId={report.id} status="Resolved" />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
