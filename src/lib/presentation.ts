export function getStatusVariant(status: string) {
  switch (status) {
    case "ACTIVE":
    case "RELEASED":
    case "PUBLISHED":
    case "DONE":
      return "success" as const;
    case "SCHEDULED":
    case "IN_PROGRESS":
    case "MASTERED":
    case "DISTRIBUTED":
      return "secondary" as const;
    case "HIGH":
    case "PAUSED":
    case "IN_REVIEW":
      return "warning" as const;
    case "DRAFT":
    case "IDEA":
    case "TODO":
    case "ARCHIVED":
      return "outline" as const;
    case "COMPLETED":
    case "CANCELED":
      return "default" as const;
    default:
      return "outline" as const;
  }
}

export function getFanEngagementVariant(score: number) {
  if (score >= 80) {
    return "success" as const;
  }

  if (score >= 50) {
    return "secondary" as const;
  }

  if (score >= 25) {
    return "warning" as const;
  }

  return "outline" as const;
}
