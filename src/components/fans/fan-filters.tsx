import Link from "next/link";
import type { Route } from "next";
import { Search, UserRoundPlus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { FanFilterOptionsDto } from "@/services/fans-types";

type FanFiltersProps = {
  filters: {
    query?: string;
    tag?: string;
    city?: string;
  };
  options: FanFilterOptionsDto;
  resultCount: number;
};

export function FanFilters({ filters, options, resultCount }: FanFiltersProps) {
  return (
    <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
      <CardContent className="p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              CRM board
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold leading-none">
              Search the audience layer
            </h2>
          </div>
          <span className="rounded-full border border-black/12 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {resultCount} result{resultCount === 1 ? "" : "s"}
          </span>
        </div>
        <form className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <div className="space-y-2">
            <Label htmlFor="fan-filter-query" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Search fans
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fan-filter-query"
                name="query"
                defaultValue={filters.query ?? ""}
                placeholder="Name, email, handle, or city"
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fan-filter-tag" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Tag
            </Label>
            <Select id="fan-filter-tag" name="tag" defaultValue={filters.tag ?? ""}>
              <option value="">All tags</option>
              {options.tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fan-filter-city" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              City
            </Label>
            <Select id="fan-filter-city" name="city" defaultValue={filters.city ?? ""}>
              <option value="">All cities</option>
              {options.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <Link
              href={"/fans/new" as Route}
              className={cn(buttonVariants(), "h-12 w-full rounded-full px-5 sm:w-auto")}
            >
              <UserRoundPlus className="size-4" />
              New fan
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 lg:col-span-4">
            <button className={cn(buttonVariants(), "h-12 rounded-full px-5")} type="submit">
              Apply filters
            </button>
            <Link
              href={"/fans" as Route}
              className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-full border-black/12 bg-white px-5")}
            >
              Clear
            </Link>
          </div>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {resultCount} fan{resultCount === 1 ? "" : "s"} matched your current search and filters.
        </p>
      </CardContent>
    </Card>
  );
}
