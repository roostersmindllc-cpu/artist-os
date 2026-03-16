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
    <Card className="border-border/70 bg-card/85">
      <CardContent className="p-5">
        <form className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <div className="space-y-2">
            <Label htmlFor="fan-filter-query">Search fans</Label>
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
            <Label htmlFor="fan-filter-tag">Tag</Label>
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
            <Label htmlFor="fan-filter-city">City</Label>
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
              className={cn(buttonVariants(), "w-full rounded-xl sm:w-auto")}
            >
              <UserRoundPlus className="size-4" />
              New fan
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 lg:col-span-4">
            <button className={cn(buttonVariants(), "rounded-xl")} type="submit">
              Apply filters
            </button>
            <Link
              href={"/fans" as Route}
              className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}
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
