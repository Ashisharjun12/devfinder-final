'use client';

import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface ProjectFilterProps {
  currentFilter: 'all' | 'my';
  onFilterChange: (filter: 'all' | 'my') => void;
}

export function ProjectFilter({ currentFilter, onFilterChange }: ProjectFilterProps) {
  return (
    <div className="flex gap-2 sm:gap-4 w-full">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        onClick={() => onFilterChange('all')}
        className={`relative flex-1 sm:flex-none px-3 sm:px-6 text-xs sm:text-sm ${
          currentFilter === 'all' 
            ? 'bg-primary hover:bg-primary-hover text-white' 
            : 'hover:border-primary/50 hover:text-white'
        }`}
      >
        <span className="hidden sm:inline">All Projects</span>
        <span className="sm:hidden">All</span>
        {currentFilter === 'all' && (
          <motion.div
            layoutId="activeFilter"
            className="absolute inset-0 bg-primary rounded-md"
            style={{ zIndex: -1 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Button>
      <Button
        variant={currentFilter === 'my' ? 'default' : 'outline'}
        onClick={() => onFilterChange('my')}
        className={`relative flex-1 sm:flex-none px-3 sm:px-6 text-xs sm:text-sm ${
          currentFilter === 'my' 
            ? 'bg-primary hover:bg-primary-hover text-white' 
            : 'hover:border-primary/50 hover:text-white'
        }`}
      >
        <span className="hidden sm:inline">My Projects</span>
        <span className="sm:hidden">My Projects</span>
        {currentFilter === 'my' && (
          <motion.div
            layoutId="activeFilter"
            className="absolute inset-0 bg-primary rounded-md"
            style={{ zIndex: -1 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Button>
    </div>
  );
}
