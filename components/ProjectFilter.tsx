'use client';

import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import Link from "next/link";

interface ProjectFilterProps {
  currentFilter: 'all' | 'my';
  onFilterChange: (filter: 'all' | 'my') => void;
}

export function ProjectFilter({ currentFilter, onFilterChange }: ProjectFilterProps) {
  const handleJoinCommunity = () => {
    window.open('https://chat.whatsapp.com/B8aC6Tpt7EJA8ykRdEzK27', '_blank');
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Left side - Filter Buttons */}
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

      {/* Right side - Join Community Button */}
      <Button 
        onClick={handleJoinCommunity}
        className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-6 border-none"
      >
        <Users className="h-4 w-4 mr-2" />
        Join Community
      </Button>
    </div>
  );
}
