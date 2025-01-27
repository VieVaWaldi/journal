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

// Define medication types as a union type
type MedicationType = "MTP" | "MWO" | "No" | "no" | null;

interface MedicationData {
  type: MedicationType;
  amount: number | null;
}

interface JournalEntry {
  date: Date;
  mType: MedicationData;
  description: string | null;
  feelings: string | null;
}

interface MedicationChartProps {
  journalData: JournalEntry[];
  dateInterval: number;
  title: string;
  description: string;
  durationDays: number | null;
}

// Update CustomBarProps to match recharts expected shape
interface CustomBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: {
    mType: MedicationType;
  };
}

const CustomBar = ({ x, y, width, height, payload }: CustomBarProps) => {
  const getBarColor = (type: MedicationType) => {
    switch (type) {
      case "MTP":
        return "fill-orange-500";
      case "MWO":
        return "fill-green-500";
      case "No":
      case "no":
        return "fill-white dark:fill-black";
      default:
        return "fill-white dark:fill-black";
    }
  };

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      className={`${getBarColor(payload.mType)} stroke-border`}
      strokeWidth={1}
    />
  );
};

interface ChartDataPoint {
  date: Date | null;
  mType: MedicationType;
  value: number;
  amount: number | null;
  description: string | null;
  feelings: string | null;
  month: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
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

        <div className="py-2 border-b">
          <p className="text-sm text-muted-foreground">
            Type: {data.mType || "None"}
          </p>
          {data.amount !== null && (
            <p className="text-sm text-muted-foreground">
              Amount: {data.amount}
            </p>
          )}
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

export function MedicationChart({
  journalData,
  title,
  description,
  dateInterval,
  durationDays,
}: MedicationChartProps) {
  const startDate = durationDays
    ? subDays(new Date(), durationDays)
    : new Date("2024-11-10");

  const chartData = journalData
    .filter((entry) => entry.date >= startDate)
    .map((entry) => {
      const isValidDate =
        entry.date instanceof Date && !isNaN(entry.date.getTime());

      if (!isValidDate) {
        return {
          date: null,
          mType: null,
          value: 0,
          amount: null,
          description: null,
          feelings: null,
          month: "Unknown",
        };
      }

      const value = entry.mType.amount || 1;

      return {
        date: entry.date,
        mType: entry.mType.type,
        value: value,
        amount: entry.mType.amount,
        description: entry.description,
        feelings: entry.feelings,
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
              barSize={40}
              barCategoryGap={0}
              barGap={0}
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
              />
              <YAxis
                domain={[0, 3]}
                tickLine={false}
                axisLine={false}
                padding={{ top: 0 }}
                ticks={[0, 1, 2, 3]}
                label={{
                  value: "Amount",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                shape={(props: any) => <CustomBar {...props} />}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default MedicationChart;
