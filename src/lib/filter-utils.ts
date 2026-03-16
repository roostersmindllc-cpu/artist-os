export function hasActiveFilters(values: Record<string, unknown>) {
  return Object.values(values).some((value) => {
    if (Array.isArray(value)) {
      return value.some(Boolean);
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return value !== undefined && value !== null && value !== false;
  });
}
