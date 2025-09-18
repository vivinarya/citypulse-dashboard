'use client';

import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { Report } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  reports: {
    label: 'Reports',
  },
  submitted: {
    label: 'Submitted',
    color: 'hsl(var(--chart-1))',
  },
  inprogress: {
    label: 'In Progress',
    color: 'hsl(var(--chart-4))',
  },
  resolved: {
    label: 'Resolved',
    color: 'hsl(var(--chart-2))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export default function StatusChart({ data }: { data: Report[] }) {
  const chartData = useMemo(() => {
    const statusCounts = data.reduce((acc, report) => {
      let key;
      switch (report.status) {
        case 'Submitted':
          key = 'submitted';
          break;
        case 'In Progress':
          key = 'inprogress';
          break;
        case 'Resolved':
          key = 'resolved';
          break;
        case 'Rejected':
          key = 'rejected';
          break;
      }
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: chartConfig[status as keyof typeof chartConfig]?.label,
      reports: count,
      fill: `var(--color-${status})`,
    }));
  }, [data]);

  const totalReports = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.reports, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col xl:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Issue Status Distribution</CardTitle>
        <CardDescription>
          Current status of all reported issues.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="reports"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalReports.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Reports
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
