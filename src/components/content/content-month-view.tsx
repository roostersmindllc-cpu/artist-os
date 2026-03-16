import { addDays, endOfWeek, format, isSameMonth, isToday, startOfWeek } from "date-fns";

import { ContentAgendaList } from "@/components/content/content-agenda-list";
import { ContentEventCard } from "@/components/content/content-event-card";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ContentPlannerItemDto, ContentPlannerRangeDto } from "@/services/content-types";

type ContentMonthViewProps = {
  items: ContentPlannerItemDto[];
  range: ContentPlannerRangeDto;
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ContentMonthView({ items, range }: ContentMonthViewProps) {
  const gridStart = startOfWeek(range.start);
  const gridEnd = endOfWeek(range.end);
  const days: Date[] = [];

  for (let cursor = gridStart; cursor <= gridEnd; cursor = addDays(cursor, 1)) {
    days.push(cursor);
  }

  return (
    <>
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border/60 bg-background/45">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const dayItems = items.filter(
                (item) => format(item.dueDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
              );

              return (
                <div
                  key={day.toISOString()}
                  className="min-h-44 border-b border-r border-border/60 bg-card/70 p-3 last:border-r-0"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex size-9 items-center justify-center rounded-full text-sm font-medium",
                        isToday(day)
                          ? "bg-primary text-primary-foreground"
                          : "bg-background/70 text-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {!isSameMonth(day, range.anchorDate) ? (
                      <span className="text-xs text-muted-foreground">Adjacent</span>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    {dayItems.slice(0, 3).map((item) => (
                      <ContentEventCard key={item.id} item={item} variant="compact" />
                    ))}
                    {dayItems.length > 3 ? (
                      <p className="text-xs text-muted-foreground">
                        +{dayItems.length - 3} more planned items
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="md:hidden">
        <ContentAgendaList
          items={items}
          emptyTitle="Nothing planned this month"
          emptyDescription="Add a content item to start filling the calendar with due dates and channel-specific work."
        />
      </div>
    </>
  );
}
