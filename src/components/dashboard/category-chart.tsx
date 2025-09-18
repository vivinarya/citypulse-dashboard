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

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function CategoryChart({ data }: { data: Report[] }) {
  const { chartData, chartConfig } = useMemo(() => {
    if (!data) {
      return { chartData: [], chartConfig: {} };
    }

    const categoryCounts = data.reduce((acc, report) => {
      const category = report.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const newChartData = Object.entries(categoryCounts).map(
      ([category, count]) => ({
        category,
        reports: count,
        fill: `var(--color-${category.replace(/[\s/&]+/g, '')})`,
      })
    );
    
    const newChartConfig = {
      reports: {
        label: 'Reports',
      },
      ...Object.keys(categoryCounts).reduce((acc, category, index) => {
        acc[category.replace(/[\s/&]+/g, '')] = {
          label: category,
          color: chartColors[index % chartColors.length],
        };
        return acc;
      }, {} as ChartConfig),
    } satisfies ChartConfig;

    return { chartData: newChartData, chartConfig: newChartConfig };
  }, [data]);

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Issues by Category</CardTitle>
        <CardDescription>
          A breakdown of reported issues by their category.
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
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => value}
              className="text-xs"
              width={100}
            />
            <XAxis dataKey="reports" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" hideLabel/>}
            />
            <Bar dataKey="reports" layout="vertical" radius={5}>
               {chartData.map((entry) => (
                <Bar
                  key={entry.category}
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
