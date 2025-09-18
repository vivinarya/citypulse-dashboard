'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
} from '@/components/ui/chart';
import type { Report } from '@/lib/types';
import { useMemo } from 'react';

export default function DepartmentChart({ data }: { data: Report[] }) {
  const { chartData, chartConfig } = useMemo(() => {
    if (!data) {
      return { chartData: [], chartConfig: {} };
    }

    const departmentCounts = data.reduce((acc, report) => {
      const department = report.department || 'Unassigned';
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const newChartData = Object.entries(departmentCounts).map(
      ([department, count]) => ({
        department,
        reports: count,
        fill: `var(--color-${department.replace(/[\s/&]+/g, '')})`,
      })
    );

    const newChartConfig = {
      reports: {
        label: 'Reports',
      },
      ...Object.keys(departmentCounts).reduce((acc, department, index) => {
        acc[department.replace(/[\s/&]+/g, '')] = {
          label: department,
          color: `hsl(var(--chart-${(index % 5) + 1}))`,
        };
        return acc;
      }, {} as ChartConfig),
    } satisfies ChartConfig;

    return { chartData: newChartData, chartConfig: newChartConfig };
  }, [data]);
  
  const shortenDepartmentName = (name: string) => {
    const wordMapping: { [key: string]: string } = {
        'Department': 'Dept.',
        'Public': 'Pub.',
        'Works': 'Wrks.',
        'Water': 'Wtr.',
        'Logging': 'Log.',
        'Traffic': 'Trfc.',
        'Signal': 'Sig.',
        'Obstruction': 'Obs.',
    }
    
    const words = name.split(' ');
    if (words.length > 2) {
        return words.map(word => wordMapping[word] || word.charAt(0)).join('');
    }
    
    return name;
  }

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Issues by Department</CardTitle>
        <CardDescription>
          A breakdown of reported issues by assigned department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 30,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="department"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => shortenDepartmentName(value)}
              className="text-xs"
              width={80}
            />
            <XAxis dataKey="reports" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" hideLabel />}
            />
            <Bar dataKey="reports" layout="vertical" radius={5}>
                {chartData.map((entry) => (
                    <Bar
                    key={entry.department}
                    dataKey="reports"
                    fill={entry.fill}
                    />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
