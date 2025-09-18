
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface DashboardFilterProps {
  departments: string[];
  categories: string[];
}

export default function DashboardFilter({
  departments,
  categories,
}: DashboardFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (type: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === 'all') {
      current.delete(type);
    } else {
      current.set(type, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('department');
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const hasActiveFilters = searchParams.has('category') || searchParams.has('department');

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
      <p className="text-sm font-medium text-muted-foreground">Filters:</p>
      <Select
        onValueChange={(value) => handleFilterChange('category', value)}
        value={searchParams.get('category') || 'all'}
      >
        <SelectTrigger className="h-9 w-full sm:w-[200px]">
          <SelectValue placeholder="Filter by Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => handleFilterChange('department', value)}
        value={searchParams.get('department') || 'all'}
      >
        <SelectTrigger className="h-9 w-full sm:w-[200px]">
          <SelectValue placeholder="Filter by Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button variant="ghost" onClick={resetFilters} className="h-9 px-3">
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
