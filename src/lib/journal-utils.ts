"use client";
const JOURNAL_KEY = "JOURNAL";
const isBrowser = () => typeof window !== "undefined";

export function updateJournal(text: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(JOURNAL_KEY, text);
  } catch (error) {
    console.error("Error updating journal:", error);
  }
}

export function removeJournal(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(JOURNAL_KEY);
  } catch (error) {
    console.error("Error removing journal:", error);
  }
}

export function getJournal(): JournalEntry[] {
  if (!isBrowser()) return [];

  try {
    const text = localStorage.getItem(JOURNAL_KEY);
    if (!text) return [];
    return processTextJournal(text);
  } catch (error) {
    console.error("Error getting journal data:", error);
    return [];
  }
}
// === //

export interface JournalEntry {
  date: Date;
  substances: string | null;
  mType: {
    amount: number | null;
    type: "MTP" | "MWO" | "No" | null;
  };
  routines: {
    morning: boolean | null;
    work: boolean | null;
    night: boolean | null;
  };
  sleepSchedule: {
    morning: string | null;
    night: string | null;
  };
  description: string | null;
  feelings: string | null;
}

// === //

function processTextJournal(text: string): JournalEntry[] {
  // Split the text into blocks of entries
  const blocks = text.split("\n\n").filter((block) => block.trim());

  const entries: JournalEntry[] = blocks.map((block) => {
    // Split each block into lines and remove bullet points and whitespace
    const lines = block
      .split("\n")
      .map((line) => line.trim().replace(/^•\s*/, ""));

    // Process date (first line)
    const dateStr = lines[0].split(",")[0];
    const [day, month, year] = dateStr.split(".").map(Number);
    // Create date in Berlin timezone
    const date = new Date(Date.UTC(2000 + year, month - 1, day));
    date.setUTCHours(0, 0, 0, 0);

    // Process substances (second line)
    const substances = lines[1] ? lines[1].toLowerCase() : null;

    // Process mType (third line)
    const mTypeRaw = lines[2] ? lines[2].toLowerCase() : "";
    const mType = processMType(mTypeRaw);

    // Process routines (fourth line)
    const routines = processRoutines(lines[3]);

    // Process sleep schedule (fifth line)
    const sleepSchedule = processSleepSchedule(lines[4]);

    // Process description and feelings (sixth and seventh lines)
    const description = lines[5] || null;
    const feelings = lines[6] || null;

    return {
      date,
      substances,
      mType,
      routines,
      sleepSchedule,
      description,
      feelings,
    };
  });
  return entries.toReversed();
}

function processMType(line: string): {
  amount: number | null;
  type: "MTP" | "MWO" | "No" | null;
} {
  if (!line) {
    return { amount: null, type: null };
  }

  // Check for simple "No" case
  if (line.toLowerCase() === "no") {
    return { amount: null, type: "No" };
  }

  // Extract number and type
  const match = line.match(/(\d+)\s*(mtp|mwo)/i);
  if (match) {
    return {
      amount: parseInt(match[1]),
      type: match[2].toUpperCase() as "MTP" | "MWO",
    };
  }

  // Handle case where there's just a type without number
  if (line.toLowerCase().includes("mtp")) {
    return { amount: null, type: "MTP" };
  }
  if (line.toLowerCase().includes("mwo")) {
    return { amount: null, type: "MWO" };
  }

  return { amount: null, type: null };
}

function processRoutines(line: string): {
  morning: boolean | null;
  work: boolean | null;
  night: boolean | null;
} {
  if (!line) {
    return { morning: null, work: null, night: null };
  }

  const parts = line
    .toLowerCase()
    .split(",")
    .map((part) => part.trim());

  // Only process if we have exactly three parts
  if (parts.length === 3) {
    return {
      morning: parts[0] === "yes",
      work: parts[1] === "yes",
      night: parts[2] === "yes",
    };
  }

  return { morning: null, work: null, night: null };
}

function processSleepSchedule(line: string): {
  morning: string | null;
  night: string | null;
} {
  if (!line) {
    return { morning: null, night: null };
  }

  // Split by "and" and process each time
  const times = line
    .toLowerCase()
    .split("and")
    .map((part) => {
      // Handle formats like "1.30" or "1.3" (meaning 1:30) or "8.15"
      const dotMatch = part.match(/(\d+)\.(\d+)/);
      if (dotMatch) {
        // Instead of using _, we directly access array indices
        // dotMatch[0] is the full match, [1] is hours, [2] is minutes
        const hours = dotMatch[1];
        const minutes = dotMatch[2];

        // If minutes is single digit, multiply by 10 (e.g., 1.3 becomes 1:30)
        const adjustedMinutes =
          minutes.length === 1 ? parseInt(minutes) * 10 : minutes;
        return `${hours}:${adjustedMinutes.toString().padStart(2, "0")}`;
      }

      // Handle plain hours like "3" or already formatted times like "8:15"
      const plainMatch = part.match(/(\d+)(?::(\d+))?/);
      if (plainMatch) {
        // Instead of destructuring with _, access array indices directly
        const hours = plainMatch[1];
        const minutes = plainMatch[2];
        return minutes ? `${hours}:${minutes}` : `${hours}:00`;
      }

      return null;
    });

  return {
    morning: times[0],
    night: times[1] || null,
  };
}
