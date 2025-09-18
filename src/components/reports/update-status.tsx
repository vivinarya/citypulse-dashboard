'use client';

import { useState } from 'react';
import type { Report, ReportStatus } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { updateReportStatusAction } from '@/app/actions';
import { Loader2 } from 'lucide-react';

export default function UpdateStatus({ report }: { report: Report }) {
  const [status, setStatus] = useState<Report['status']>(report.status);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const result = await updateReportStatusAction(report.id, status);
      if (result.success) {
        toast({
          title: 'Status Updated',
          description: `Report #${report.id} status changed to "${status}".`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update the report status.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="status-select">Change Status</Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as Report['status'])}
          name="status-select"
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="notification-message">Notification Message</Label>
        <Textarea
          id="notification-message"
          placeholder="Optional: Add a message for the user..."
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          This will be sent to the user who submitted the report.
        </p>
      </div>
      <Button onClick={handleUpdate} className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update and Notify
      </Button>
    </div>
  );
}
