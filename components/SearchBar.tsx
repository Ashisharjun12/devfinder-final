'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { TechIcon, techList } from './ui/tech-icon';
import { X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchBarProps {
  onSearch: (query: { text: string; techs: string[] }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchText, setSearchText] = useState('');
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const debouncedSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    onSearch({ text: debouncedSearchText, techs: selectedTechs });
  }, [debouncedSearchText, selectedTechs, onSearch]);

  const handleTechSelect = (tech: string) => {
    const newTechs = [...selectedTechs, tech];
    setSelectedTechs(newTechs);
    setShowTechSuggestions(false);
  };

  const handleRemoveTech = (tech: string) => {
    const newTechs = selectedTechs.filter(t => t !== tech);
    setSelectedTechs(newTechs);
  };

  const handleTextSearch = (text: string) => {
    setSearchText(text);
  };

  const filteredTechs = techList.filter(tech => 
    tech.toLowerCase().includes(searchText.toLowerCase()) &&
    !selectedTechs.includes(tech)
  );

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search projects by name or technology..."
          value={searchText}
          onChange={(e) => handleTextSearch(e.target.value)}
          onFocus={() => setShowTechSuggestions(true)}
          className="pl-10 pr-4 h-12 bg-secondary/50 border-secondary"
        />
      </div>

      {selectedTechs.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTechs.map(tech => (
            <Badge
              key={tech}
              variant="secondary"
              className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <TechIcon name={tech} className="h-4 w-4" showBackground />
              {tech}
              <X
                className="ml-1 h-3 w-3 cursor-pointer hover:text-primary-hover"
                onClick={() => handleRemoveTech(tech)}
              />
            </Badge>
          ))}
        </div>
      )}

      {showTechSuggestions && searchText && filteredTechs.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-secondary/95 backdrop-blur-sm rounded-md shadow-lg border border-primary/20">
          <div className="p-2 max-h-60 overflow-y-auto">
            {filteredTechs.map(tech => (
              <div
                key={tech}
                className="flex items-center gap-2 px-3 py-2 hover:bg-primary/20 rounded-md cursor-pointer transition-colors"
                onClick={() => handleTechSelect(tech)}
              >
                <TechIcon name={tech} className="h-4 w-4" showBackground />
                {tech}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
