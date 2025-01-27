"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSubstanceIntensity } from "@/lib/substances-utils";
import { JournalEntry } from "@/lib/journal-utils";

interface BarChartDateProps {
  journalData: JournalEntry[];
  dateInterval: number;
  title: string;
  description: string;
  durationDays: number | null;
}

interface TooltipData {
  date: Date | null;
  intensity: number;
  text: string;
  month: string;
  description?: string;
  feelings?: string;
}

// Define the structure of the payload item
interface TooltipPayloadItem {
  payload: TooltipData;
  // Add other potential payload properties from recharts
  dataKey: string;
  name: string;
  value: number;
}

// Define the main props interface for the CustomTooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  // Add any additional props you might need
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg max-w-[280px]">
        {/* Date header with weekday */}
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

        <div className="py-2 border-b">
          <p className="text-sm text-muted-foreground">
            Intensity: {data.intensity}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.text || "No substances"}
          </p>
        </div>

        {/* Description section - only shown if there's content */}
        {data.description && (
          <div className="pt-2">
            <p className="text-sm font-medium mb-1">Description:</p>
            <p className="text-sm text-muted-foreground break-words">
              {data.description}
            </p>
          </div>
        )}

        {/* Feelings section - only shown if there's content */}
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

export function BarChartDate({
  journalData,
  title,
  description,
  dateInterval,
  durationDays,
}: BarChartDateProps) {
  const startDate = durationDays
    ? subDays(new Date(), durationDays)
    : new Date("2024-10-24");

  const chartData = journalData
    .filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate;
    })
    .map((entry) => {
      const isValidDate =
        entry.date instanceof Date && !isNaN(entry.date.getTime());

      if (!isValidDate) {
        return {
          date: null,
          intensity: -1,
          text: "Invalid date",
          month: "Unknown",
        };
      }

      return {
        date: entry.date,
        intensity: getSubstanceIntensity(entry.substances),
        text: entry.substances,
        month: format(entry.date, "MMM d, yy"),
      };
    });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                interval={dateInterval}
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
                tickFormatter={(value) => value}
              />
              <YAxis
                domain={[0, 10]}
                tickLine={false}
                axisLine={false}
                ticks={[0, 2, 4, 6, 8, 10]}
                padding={{ top: 0 }}
                label={{
                  value: "Intensity",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
                tickFormatter={(value) => {
                  if (value === -1) return "N/A";
                  return value.toString();
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="intensity"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
