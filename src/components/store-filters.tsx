"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/debouncer";

interface StoreFiltersProps {
  priceRange: {
    min: number;
    max: number;
  };
  counts: {
    total: number;
    available: number;
    unavailable: number;
  };
  currentFilters: {
    search: string;
    sort: string;
    minPrice?: string;
    maxPrice?: string;
    availability: string;
  };
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A to Z" },
  { value: "name-za", label: "Name: Z to A" },
];

export function StoreFilters({
  priceRange,
  counts,
  currentFilters,
}: StoreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentFilters.search || "");
  const [minPriceInput, setMinPriceInput] = useState(
    currentFilters.minPrice || "",
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    currentFilters.maxPrice || "",
  );
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedMinPrice = useDebounce(minPriceInput, 400);
  const debouncedMaxPrice = useDebounce(maxPriceInput, 400);

  const createQueryString = useCallback(
    (params: Record<string, string | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const updateFilters = useCallback(
    (params: Record<string, string | undefined>) => {
      startTransition(() => {
        const queryString = createQueryString(params);
        router.push(`/store${queryString ? `?${queryString}` : ""}`);
      });
    },
    [createQueryString, router],
  );

  useEffect(() => {
    const currentSearch = currentFilters.search || "";
    if (debouncedSearch !== currentSearch) {
      updateFilters({ search: debouncedSearch || undefined });
    }
  }, [debouncedSearch, currentFilters.search, updateFilters]);

  // Debounced price filter updates
  useEffect(() => {
    const currentMin = currentFilters.minPrice || "";
    if (debouncedMinPrice !== currentMin) {
      updateFilters({ minPrice: debouncedMinPrice || undefined });
    }
  }, [debouncedMinPrice, currentFilters.minPrice, updateFilters]);

  useEffect(() => {
    const currentMax = currentFilters.maxPrice || "";
    if (debouncedMaxPrice !== currentMax) {
      updateFilters({ maxPrice: debouncedMaxPrice || undefined });
    }
  }, [debouncedMaxPrice, currentFilters.maxPrice, updateFilters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: search || undefined });
  };

  const clearFilters = () => {
    setSearch("");
    setMinPriceInput("");
    setMaxPriceInput("");
    startTransition(() => {
      router.push("/store");
    });
  };

  const hasActiveFilters =
    currentFilters.search ||
    currentFilters.minPrice ||
    currentFilters.maxPrice ||
    currentFilters.availability !== "all" ||
    currentFilters.sort !== "newest";

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-secondary/50 border-border focus:border-primary"
            />
          </div>
          <Button
            type="submit"
            className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isPending}
          >
            {isPending ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Search"
            )}
          </Button>
        </form>

        <div className="flex gap-2">
          <select
            value={currentFilters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="h-11 px-4 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-card"
              >
                {option.label}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 px-4 rounded-xl border-border ${
              showFilters ? "bg-secondary" : ""
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Price Range
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder={priceRange.min.toString()}
                    min={0}
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="pl-7 h-10 rounded-lg bg-secondary/30"
                  />
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder={priceRange.max.toString()}
                    min={0}
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="pl-7 h-10 rounded-lg bg-secondary/30"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Range: ${priceRange.min} - ${priceRange.max}
              </p>
            </div>

            {/* Availability Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Availability
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All", count: counts.total },
                  {
                    value: "available",
                    label: "Available",
                    count: counts.available,
                  },
                  {
                    value: "unavailable",
                    label: "Unavailable",
                    count: counts.unavailable,
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateFilters({ availability: option.value })
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentFilters.availability === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {option.label}
                    <span className="ml-1.5 opacity-70">({option.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actions
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="w-full h-10 rounded-lg border-border hover:bg-secondary disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {currentFilters.search && (
            <FilterTag
              label={`Search: "${currentFilters.search}"`}
              onRemove={() => {
                setSearch("");
                updateFilters({ search: undefined });
              }}
            />
          )}
          {currentFilters.minPrice && (
            <FilterTag
              label={`Min: $${currentFilters.minPrice}`}
              onRemove={() => {
                setMinPriceInput("");
                updateFilters({ minPrice: undefined });
              }}
            />
          )}
          {currentFilters.maxPrice && (
            <FilterTag
              label={`Max: $${currentFilters.maxPrice}`}
              onRemove={() => {
                setMaxPriceInput("");
                updateFilters({ maxPrice: undefined });
              }}
            />
          )}
          {currentFilters.availability !== "all" && (
            <FilterTag
              label={`Status: ${currentFilters.availability}`}
              onRemove={() => updateFilters({ availability: "all" })}
            />
          )}
          {currentFilters.sort !== "newest" && (
            <FilterTag
              label={`Sort: ${
                sortOptions.find((o) => o.value === currentFilters.sort)?.label
              }`}
              onRemove={() => updateFilters({ sort: "newest" })}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-sm text-foreground">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 hover:text-destructive transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
}
