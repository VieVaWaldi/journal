"use client";
import { BarChartDate } from "@/components/charts/BarChartDate";
import { MultiLineDate } from "@/components/charts/MultiLineDate";
import { Typography } from "@/components/text/Typography";
import { getJournal, JournalEntry } from "@/lib/journal-utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MultiBarChart_1 from "@/components/charts/MultiBarChart_1";
import MultiBarChart_2 from "@/components/charts/MultiBarChart_2";

interface DurationOption {
  label: string;
  value: number | null;
  interval: number;
}

const durationOptions: DurationOption[] = [
  { label: "7 Days", value: 8, interval: 1 },
  { label: "14 Days", value: 15, interval: 1 },
  { label: "28 Days", value: 29, interval: 3 },
  { label: "All Time", value: null, interval: 8 },
];

export default function Home() {
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>(
    durationOptions[2]
  );
  const [journalData, setJournalData] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setJournalData(getJournal());
  }, []);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <Typography text="Home" />

          <div className="flex gap-x-2">
            {durationOptions.map((option) => (
              <Button
                key={option.label}
                variant={selectedDuration === option ? "default" : "outline"}
                onClick={() => setSelectedDuration(option)}
                className="px-4 py-2"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <MultiLineDate
          journalData={journalData}
          dateInterval={selectedDuration.interval}
          durationDays={selectedDuration.value}
          title="Sleep"
          description="Daily Wakeup and Sleep time"
        />

        <BarChartDate
          journalData={journalData}
          dateInterval={selectedDuration.interval}
          durationDays={selectedDuration.value}
          title="Substances"
          description="Daily Substance Level"
        />

        <MultiBarChart_1
          journalData={journalData}
          dateInterval={selectedDuration.interval}
          durationDays={selectedDuration.value}
          title="Routines"
          description="Daily Morning, Work and Night routine"
        />

        <MultiBarChart_2
          journalData={journalData}
          dateInterval={selectedDuration.interval}
          durationDays={selectedDuration.value}
          title="M Types"
          description="Daily mTypes"
        />
      </div>
    </div>
  );
}
