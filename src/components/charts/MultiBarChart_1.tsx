import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format, subDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JournalEntry {
  date: Date;
  routines: {
    morning: boolean | null;
    work: boolean | null;
    night: boolean | null;
  };
  description: string | null;
  feelings: string | null;
}

interface MultiBarChartProps {
  journalData: JournalEntry[];
  dateInterval: number;
  title: string;
  description: string;
  durationDays: number | null;
}

interface CustomBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: {
    morning: boolean;
    work: boolean;
    night: boolean;
  };
}

interface Section {
  value: boolean;
  yPosition: number;
}

const CustomBar: React.FC<CustomBarProps> = ({
  x,
  y,
  width,
  height,
  payload,
}) => {
  const sections: Section[] = [
    { value: payload.morning, yPosition: 0 },
    { value: payload.work, yPosition: 1 },
    { value: payload.night, yPosition: 2 },
  ];

  return (
    <g>
      {sections.map((section, index) => {
        const fillClass = section.value
          ? "fill-green-500"
          : "fill-white dark:fill-black";

        return (
          <rect
            key={index}
            x={x}
            y={y + height * (1 - (section.yPosition + 1) / 3)}
            width={width}
            height={height / 3}
            className={fillClass}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
};

interface ChartDataPoint {
  date: Date | null;
  month: string;
  morning: boolean;
  work: boolean;
  night: boolean;
  description: string | null;
  feelings: string | null;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

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

        <div className="py-2 border-b">
          <p className="text-sm text-muted-foreground">
            Night: {data.night ? "Yes" : "No"}
          </p>
          <p className="text-sm text-muted-foreground">
            Work: {data.work ? "Yes" : "No"}
          </p>
          <p className="text-sm text-muted-foreground">
            Morning: {data.morning ? "Yes" : "No"}
          </p>
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

export function MultiBarChart({
  journalData,
  title,
  description,
  dateInterval,
  durationDays,
}: MultiBarChartProps) {
  const startDate = durationDays
    ? subDays(new Date(), durationDays)
    : new Date("2024-12-21");

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
          month: "Unknown",
          morning: false,
          work: false,
          night: false,
          description: null,
          feelings: null,
          value: 3,
        };
      }

      return {
        date: entry.date,
        month: format(entry.date, "MMM d, yy"),
        morning: entry.routines.morning || false,
        work: entry.routines.work || false,
        night: entry.routines.night || false,
        description: entry.description || null,
        feelings: entry.feelings || null,
        value: 3,
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
              height={300}
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
                ticks={[0, 1, 2, 3]}
                tickFormatter={(value) => {
                  switch (value) {
                    case 0:
                      return "";
                    case 1:
                      return "Morning";
                    case 2:
                      return "Work";
                    case 3:
                      return "Night";
                    default:
                      return "";
                  }
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

export default MultiBarChart;
