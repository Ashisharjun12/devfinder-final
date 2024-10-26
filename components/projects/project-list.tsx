"use client"

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, memo } from 'react';
import { ProjectCard } from './project-card';

// Memoized ProjectCard for better performance
const MemoizedProjectCard = memo(ProjectCard);

export function ProjectList({ projects }: { projects: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: projects.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300, // Estimated height of each project card
    overscan: 5 // Number of items to render outside visible area
  });

  return (
    <div 
      ref={parentRef} 
      className="h-[800px] overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <MemoizedProjectCard project={projects[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
