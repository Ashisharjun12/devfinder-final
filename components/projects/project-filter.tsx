"use client"

import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function ProjectFilter({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all"
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const filterOptions = useMemo(() => ({
    categories: ["all", "web", "mobile", "design"],
    statuses: ["all", "active", "completed", "archived"]
  }), []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  return (
    <div className="flex gap-4">
      <Input
        type="search"
        placeholder="Search projects..."
        value={filters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        className="max-w-sm"
      />
      
      <Select
        value={filters.category}
        onValueChange={(value) => handleFilterChange("category", value)}
      >
        {filterOptions.categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        {filterOptions.statuses.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </Select>
    </div>
  );
}
