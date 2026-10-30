"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriesList } from "@/lib/mock-data";
import { Search, ArrowUpDown, X, SlidersHorizontal, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sortBy: "date-asc" | "date-desc" | "popular";
  setSortBy: (value: "date-asc" | "date-desc" | "popular") => void;
  onReset: () => void;
  totalResults: number;
}

export function EventFilters({
  search,
  setSearch,
  locationFilter,
  setLocationFilter,
  category,
  setCategory,
  sortBy,
  setSortBy,
  onReset,
  totalResults,
}: EventFiltersProps) {
  const hasActiveFilters =
    search.trim() !== "" ||
    locationFilter.trim() !== "" ||
    category !== "All" ||
    sortBy !== "date-asc";

  return (
    <div className="space-y-4 bg-card border border-border/70 p-5 rounded-2xl shadow-sm">
      {/* Top Bar: Search, Location, and Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Title Search Input */}
        <div className="relative lg:col-span-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Location Input */}
        <div className="relative lg:col-span-4">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Location (e.g. Mirpur, Dhanmondi, Sylhet)..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="pl-10 h-11"
          />
          {locationFilter && (
            <button
              onClick={() => setLocationFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear location filter"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="lg:col-span-3">
          <Select
            value={sortBy}
            onValueChange={(val: "date-asc" | "date-desc" | "popular") =>
              setSortBy(val)
            }
          >
            <SelectTrigger className="h-11">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date: Soonest First</SelectItem>
              <SelectItem value="date-desc">Date: Latest First</SelectItem>
              <SelectItem value="popular">Most Volunteers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 shrink-0 mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Category:
          </span>
          {categoriesList.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer border",
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-background text-foreground/80 border-border hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-destructive shrink-0 h-8 px-2"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results Count Line */}
      <div className="text-xs text-muted-foreground pt-1 flex items-center justify-between">
        <span>
          Showing <strong className="text-foreground">{totalResults}</strong> events
        </span>
        {category !== "All" && (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Category: {category}
          </span>
        )}
      </div>
    </div>
  );
}
