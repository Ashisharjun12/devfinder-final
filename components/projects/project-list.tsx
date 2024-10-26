"use client"

import { useEffect, useState } from 'react';
import { getProjects } from '@/lib/actions/project.actions';
import { ProjectCard } from './project-card';
import { useRouter } from 'next/navigation';

// Create a custom event for project updates
export const PROJECT_UPDATED_EVENT = 'projectUpdated';

export function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Listen for project updates
    const handleProjectUpdate = () => {
      fetchProjects();
    };

    window.addEventListener(PROJECT_UPDATED_EVENT, handleProjectUpdate);

    return () => {
      window.removeEventListener(PROJECT_UPDATED_EVENT, handleProjectUpdate);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project}
        />
      ))}
    </div>
  );
}
