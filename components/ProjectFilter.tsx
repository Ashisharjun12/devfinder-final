'use client';

import { Button } from "./ui/button";
import { useState } from "react";

interface ProjectFilterProps {
  onFilterChange: (filter: 'all' | 'my') => void;
  currentFilter: 'all' | 'my';
}

export function ProjectFilter({ onFilterChange, currentFilter }: ProjectFilterProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        onClick={() => onFilterChange('all')}
        className="rounded-full"
      >
        All Projects
      </Button>
      <Button
        variant={currentFilter === 'my' ? 'default' : 'outline'}
        onClick={() => onFilterChange('my')}
        className="rounded-full"
      >
        My Projects
      </Button>
    </div>
  );
}
