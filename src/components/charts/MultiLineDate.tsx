"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { format, subDays } from "date-fns";

// Define comprehensive interfaces for type safety
interface SleepSchedule {
  morning: string | null;
  night: string | null;
}

interface JournalEntry {
  date: Date | string;
  sleepSchedule: SleepSchedule;
  description?: string | null;
  feelings?: string | null;
}

interface ChartDataPoint {
  date: Date;
  displayDate: string;
  wakeup: number | null;
  bedtime: number | null;
  sleepSchedule: SleepSchedule;
  description?: string | null;
  feelings?: string | null;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

interface MultiLineDateProps {
  journalData: JournalEntry[];
  dateInterval: number;
  title: string;
  description: string;
  durationDays: number | null;
}

// Strongly typed chart configuration
const chartConfig: ChartConfig = {
  wakeup: {
    label: "Wake Up Time",
    color: "hsl(var(--chart-1))",
  },
  bedtime: {
    label: "Bedtime",
    color: "hsl(var(--chart-2))",
  },
} as const;

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg max-w-[280px]">
        <p className="font-medium border-b pb-2">
          {data.date ? (
            <>
              {format(data.date, "MMMM d, yyyy")}
              <span className="text-muted-foreground ml-2">
                {format(data.date, "EEEE")}
              </span>
            </>
          ) : (
            "Invalid Date"
          )}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium">Fell asleep: </span>
            <span className="text-muted-foreground">
              {data.sleepSchedule.morning || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium">Woke Up: </span>
            <span className="text-muted-foreground">
              {data.sleepSchedule.night || "N/A"}
            </span>
          </div>
        </div>

        {data.description && (
          <div className="pt-2">
            <p className="text-sm font-medium mb-1">Description:</p>
            <p className="text-sm text-muted-foreground break-words">
              {data.description}
            </p>
          </div>
        )}

        {data.feelings && (
          <div className="pt-2">
            <p className="text-sm font-medium mb-1">Feelings:</p>
            <p className="text-sm text-muted-foreground break-words">
              {data.feelings}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function MultiLineDate({
  journalData,
  dateInterval,
  title,
  description,
  durationDays,
}: MultiLineDateProps) {
  const startDate = durationDays
    ? subDays(new Date(), durationDays)
    : new Date("2024-12-10");

  // Transform and validate the journal data
  const chartData = journalData
    .filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate;
    })
    .map(
      (entry): ChartDataPoint => ({
        date: new Date(entry.date),
        displayDate: format(new Date(entry.date), "MMM d, yy"),
        wakeup: timeToDecimal(entry.sleepSchedule.morning),
        bedtime: timeToDecimal(entry.sleepSchedule.night),
        sleepSchedule: entry.sleepSchedule,
        description: entry.description,
        feelings: entry.feelings,
      })
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full min-h-[400px]" config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              top: 2,
              right: 0,
              bottom: 20,
              left: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tickMargin={20}
              interval={dateInterval}
              angle={-45}
              textAnchor="end"
              height={60}
              fontSize={12}
            />
            <YAxis
              tickFormatter={formatTime}
              domain={[0, 14]}
              tickCount={13}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              dataKey="wakeup"
              type="linear"
              stroke="var(--color-wakeup)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="bedtime"
              type="linear"
              stroke="var(--color-bedtime)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Helper function to convert time string (HH:MM) to decimal hours
const timeToDecimal = (timeStr: string | null): number | null => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
};

// Helper function to format decimal hours back to time string
const formatTime = (decimal: number): string => {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

export default MultiLineDate;
