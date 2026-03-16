import type { Route } from "next";

export function getFanRoute(fanId: string) {
  return `/fans/${fanId}` as Route;
}

function normalizeCityValue(city: string | null) {
  return city?.trim() ?? "";
}

export function collectFanFilterOptions(
  rows: Array<{
    city: string | null;
    tags: string[];
  }>
) {
  const cityMap = new Map<string, string>();

  for (const row of rows) {
    const city = normalizeCityValue(row.city);

    if (!city) {
      continue;
    }

    const normalizedKey = city.toLowerCase();

    if (!cityMap.has(normalizedKey)) {
      cityMap.set(normalizedKey, city);
    }
  }

  const cities = [...cityMap.values()].sort((left, right) => left.localeCompare(right));
  const tags = [...new Set(rows.flatMap((row) => row.tags).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right)
  );

  return {
    cities,
    tags
  };
}
