import { format, isSameDay } from "date-fns";

import { EmptyState } from "@/components/shared/empty-state";
import { ContentEventCard } from "@/components/content/content-event-card";
import type { ContentPlannerItemDto } from "@/services/content-types";

type ContentAgendaListProps = {
  items: ContentPlannerItemDto[];
  emptyTitle: string;
  emptyDescription: string;
};

export function ContentAgendaList({
  items,
  emptyTitle,
  emptyDescription
}: ContentAgendaListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        variant="card"
        actionLabel={null}
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const showHeading =
          index === 0 || !isSameDay(items[index - 1]!.dueDate, item.dueDate);

        return (
          <div key={item.id} className="space-y-3">
            {showHeading ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {format(item.dueDate, "EEEE")}
                </p>
                <h3 className="font-heading text-xl font-semibold">
                  {format(item.dueDate, "MMMM d")}
                </h3>
              </div>
            ) : null}
            <ContentEventCard item={item} />
          </div>
        );
      })}
    </div>
  );
}
