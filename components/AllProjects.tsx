'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { TechIcon } from "./ui/tech-icon";
import { SearchBar } from "./SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDate } from "@/lib/utils";
import { Github, ExternalLink, Link2Off, GitBranch, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { FolderGit2, Rocket, Plus } from "lucide-react";
import { useRouter } from 'next/router';
import CreateProjectDialog from "./CreateProjectDialog";

interface Project {
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  githubUrl?: string;
  stage: string;
  owner: {
    name: string;
    image: string;
    email: string;
  };
  createdAt: string;
}

interface AllProjectsProps {
  initialProjects: Project[];
}

export default function AllProjects({ initialProjects }: AllProjectsProps) {
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'my'>('all');
  const { data: session } = useSession();
  const router = useRouter();

  // Get all unique skills from projects
  const allProjectSkills = Array.from(
    new Set(
      initialProjects.flatMap(project => project.requiredSkills)
    )
  );

  const handleFilterChange = (filter: 'all' | 'my') => {
    setCurrentFilter(filter);
    if (filter === 'my' && session?.user?.email) {
      setFilteredProjects(initialProjects.filter(project => 
        project.owner.email === session.user.email
      ));
    } else {
      setFilteredProjects(initialProjects);
    }
  };

  const handleSearch = ({ text, techs }: { text: string; techs: string[] }) => {
    let filtered = [...initialProjects];

    if (text) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(text.toLowerCase()) ||
        project.description.toLowerCase().includes(text.toLowerCase())
      );
    }

    if (techs.length > 0) {
      filtered = filtered.filter(project =>
        techs.every(tech => project.requiredSkills.includes(tech))
      );
    }

    if (currentFilter === 'my' && session?.user?.email) {
      filtered = filtered.filter(project => project.owner.email === session.user.email);
    }

    setFilteredProjects(filtered);
  };

  // Add function to refresh projects
  const refreshProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setFilteredProjects(data);
      }
    } catch (error) {
      console.error('Failed to refresh projects:', error);
    }
  };

  // Pass refreshProjects to ProjectCard
  const handleProjectUpdate = () => {
    refreshProjects();
  };

  const handleProjectDelete = () => {
    refreshProjects();
  };

  // Empty State Component with dynamic content
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-secondary/50 p-6 rounded-full mb-6">
        <FolderGit2 className="h-12 w-12 text-primary" />
      </div>
      {currentFilter === 'my' ? (
        <>
          <h3 className="text-2xl font-semibold mb-3">No Projects Created Yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Start your journey by creating your first project and connect with talented developers.
          </p>
          <div className="space-y-4">
            <CreateProjectDialog />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Rocket className="h-4 w-4" />
              <span>Create and collaborate on amazing projects</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-semibold mb-3">No Projects Available</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Be the first to create a project and start building with the community.
          </p>
          <div className="space-y-4">
            <CreateProjectDialog />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Plus className="h-4 w-4" />
              <span>Add a project to get started</span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <ProjectFilter 
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
        />
        <SearchBar onSearch={handleSearch} projectSkills={allProjectSkills} />
      </div>

      {/* Projects Grid with Animation */}
      {filteredProjects.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <ProjectCard 
                project={project}
                isOwner={session?.user?.email === project.owner.email}
                onUpdate={handleProjectUpdate}
                onDelete={handleProjectDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-secondary/30 rounded-xl border border-primary/10"
        >
          <EmptyState />
        </motion.div>
      )}
    </div>
  );
}
