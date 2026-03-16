import { addDays, format } from "date-fns";

import { ContentAgendaList } from "@/components/content/content-agenda-list";
import { ContentEventCard } from "@/components/content/content-event-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import type { ContentPlannerItemDto, ContentPlannerRangeDto } from "@/services/content-types";

type ContentWeekViewProps = {
  items: ContentPlannerItemDto[];
  range: ContentPlannerRangeDto;
};

export function ContentWeekView({ items, range }: ContentWeekViewProps) {
  const days = Array.from({ length: 7 }, (_, index) => addDays(range.start, index));

  return (
    <>
      <div className="hidden md:block">
        <div className="grid gap-4 lg:grid-cols-7">
          {days.map((day) => {
            const dayItems = items.filter(
              (item) => format(item.dueDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
            );

            return (
              <Card key={day.toISOString()} className="overflow-hidden">
                <CardContent className="space-y-4 p-4">
                  <div className="space-y-1 border-b border-border/60 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {format(day, "EEE")}
                    </p>
                    <h3 className="font-heading text-xl font-semibold">
                      {format(day, "MMM d")}
                    </h3>
                  </div>
                  {dayItems.length > 0 ? (
                    <div className="space-y-3">
                      {dayItems.map((item) => (
                        <ContentEventCard key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Open day"
                      description="No content currently due for this day."
                      variant="card"
                      actionLabel={null}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="md:hidden">
        <ContentAgendaList
          items={items}
          emptyTitle="Nothing planned this week"
          emptyDescription="Add a content item to start shaping the week ahead."
        />
      </div>
    </>
  );
}
