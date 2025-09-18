'use client';

import { useState } from 'react';
import { Wand2, Loader2, Building, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Report } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { runCategorization, runDepartmentAssignment } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function AiActions({ report }: { report: Report }) {
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [aiCategory, setAiCategory] = useState<string | null>(null);
  const [aiDepartment, setAiDepartment] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCategorize = async () => {
    setIsCategorizing(true);
    setAiCategory(null);
    try {
      const result = await runCategorization({
        description: report.description,
      });
      setAiCategory(result.category);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not categorize the issue.',
      });
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleAssign = async () => {
    setIsAssigning(true);
    setAiDepartment(null);
    try {
      const result = await runDepartmentAssignment({
        category: report.category,
        description: report.description,
        location: report.location.address,
      });
      setAiDepartment(result.department);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not assign a department.',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Button
          onClick={handleCategorize}
          disabled={isCategorizing}
          className="w-full gap-2"
          variant="outline"
        >
          {isCategorizing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Auto-Categorize
        </Button>
        {aiCategory && (
          <p className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-muted rounded-md">
            <Tag className="h-4 w-4 text-primary" />
            Suggested: <span className="font-semibold">{aiCategory}</span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Button
          onClick={handleAssign}
          disabled={isAssigning}
          className="w-full gap-2"
          variant="outline"
        >
          {isAssigning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Auto-Assign Department
        </Button>
        {aiDepartment && (
          <p className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-muted rounded-md">
            <Building className="h-4 w-4 text-primary" />
            Suggested: <span className="font-semibold">{aiDepartment}</span>
          </p>
        )}
      </div>
    </div>
  );
}
