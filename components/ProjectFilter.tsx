'use client';

import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface ProjectFilterProps {
  currentFilter: 'all' | 'my';
  onFilterChange: (filter: 'all' | 'my') => void;
}

export function ProjectFilter({ currentFilter, onFilterChange }: ProjectFilterProps) {
  return (
    <div className="flex gap-4">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        onClick={() => onFilterChange('all')}
        className={`relative px-6 ${
          currentFilter === 'all' 
            ? 'bg-primary hover:bg-primary-hover text-white' 
            : 'hover:border-primary/50 hover:text-white'
        }`}
      >
        All Projects
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
        className={`relative px-6 ${
          currentFilter === 'my' 
            ? 'bg-primary hover:bg-primary-hover text-white' 
            : 'hover:border-primary/50 hover:text-white'
        }`}
      >
        My Projects
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
