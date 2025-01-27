export const substanceIntensityMap: { [key: string]: number } = {
  // No substances (-1 for null, 0 for explicit "none/no")
  none: 0,
  no: 0,
  "07.11.24, th:": -1, // This appears to be a date, not a substance description

  // Light drinking (1-3)
  "1 glas wine": 1,
  "1 glas of wine": 1,
  "glass glühwein": 1,
  "1 beer": 1,
  "2 beer": 2,
  "2 glasses wine": 2,
  "3 glasses of wine": 3,
  "1 beer and 1 glas of wine": 2,
  "1 beer, 1 cocktail": 2,
  "1 glühwein and 1 cocktail": 2,

  // Moderate drinking (4-6)
  "4 beer": 4,
  "half a bottle of wine": 4,
  "1 beer, half a bottle of wine": 4,
  wine: 5, // Assuming this means a significant amount of wine
  "about a bottle of wine": 5,
  "a bottle of glühwein": 5,
  "about 1 bottle of wine": 5,
  "1 bottle wine": 5,
  "4 beer and 2 long drinks": 6,

  // Heavy drinking (7-10)
  "2 bottles of wine and 1 beer": 8,
  "1 bottle wine, 1 joint": 7,
  "1 bottle wine, 125 mg promethazin": 8,
  "8/10": 8, // Taking this as a self-reported intensity
};

// Default function to handle unknown values
export function getSubstanceIntensity(substance: string | null): number {
  if (substance === null) return -1;
  return substanceIntensityMap[substance] ?? -1;
}

// Get all unique substances
// console.log(
//   Array.from(
//     // Map over journal entries to get just the substances field
//     // Then create a Set from those values
//     new Set(journalData.map((entry) => entry.substances))
//   )
// );