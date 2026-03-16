import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <div className="border-border/70 bg-card/80 rounded-2xl border p-5 shadow-sm">
      <Skeleton className="h-3 w-24 rounded-full" />
      <Skeleton className="mt-4 h-9 w-28" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
    </div>
  );
}

export function FormPanelSkeleton() {
  return (
    <div className="border-border/70 bg-card/80 rounded-2xl border p-6 shadow-sm">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="mt-2 h-4 w-64" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-40" />
      </div>
    </div>
  );
}

export function TablePanelSkeleton() {
  return (
    <div className="border-border/70 bg-card/80 rounded-2xl border shadow-sm">
      <div className="border-border/60 border-b p-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="space-y-3 p-6">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export function AppPageSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1360px] space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <FormPanelSkeleton />
        <TablePanelSkeleton />
      </div>
    </section>
  );
}

export function ListPageSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1360px] space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="border-border/70 bg-card/85 rounded-2xl border p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="mt-4 h-4 w-72" />
      </div>
      <TablePanelSkeleton />
    </section>
  );
}

export function SplitWorkspaceSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1360px] space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <FormPanelSkeleton />
        <TablePanelSkeleton />
      </div>
    </section>
  );
}

export function ContentPlannerSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1360px] space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="border-border/70 bg-card/85 rounded-2xl border p-5 shadow-sm">
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          <div className="border-border/70 bg-card/85 rounded-2xl border p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-4">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
          <TablePanelSkeleton />
        </div>
        <div className="space-y-6">
          <FormPanelSkeleton />
          <TablePanelSkeleton />
        </div>
      </div>
    </section>
  );
}

export function AnalyticsPageSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1360px] space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="border-border/70 bg-card/85 rounded-2xl border p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <FormPanelSkeleton />
        <TablePanelSkeleton />
      </div>
      <TablePanelSkeleton />
    </section>
  );
}

export function SettingsPageSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1360px] space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <FormPanelSkeleton />
        <FormPanelSkeleton />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <TablePanelSkeleton />
        <FormPanelSkeleton />
      </div>
    </section>
  );
}
