'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TechIcon } from "./ui/tech-icon";
import { SearchBar } from "./SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDate } from "@/lib/utils";
import { Github, ExternalLink, Link2Off, GitBranch, Edit2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import CreateProjectDialog from './CreateProjectDialog';
import { EditProjectDialog } from './EditProjectDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from './ui/use-toast';
import { Plus, FolderPlus, Search as SearchIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  stage: string;
  githubUrl?: string;
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
  const [selectedTech, setSelectedTech] = useState<string | undefined>();
  const { data: session } = useSession();
  const { toast } = useToast();

  // Get all unique skills from projects
  const allProjectSkills = Array.from(
    new Set(
      initialProjects.flatMap(project => project.requiredSkills)
    )
  );

  const fetchProjects = async (filter: 'all' | 'my' = 'all') => {
    try {
      const params = new URLSearchParams();
      if (filter === 'my' && session?.user?.email) {
        params.append('owner', session.user.email);
      }
      const response = await fetch(`/api/projects?${params.toString()}`);
      if (response.ok) {
        const projects = await response.json();
        setFilteredProjects(projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects(currentFilter);
  }, [currentFilter, session]);

  const handleSearch = async ({ text, techs }: { text: string; techs: string[] }) => {
    try {
      const params = new URLSearchParams();
      if (text) params.append('query', text);
      if (techs.length) params.append('tech', techs.join(','));
      if (currentFilter === 'my' && session?.user?.email) {
        params.append('owner', session.user.email);
      }

      const response = await fetch(`/api/projects?${params.toString()}`);
      if (response.ok) {
        const projects = await response.json();
        setFilteredProjects(projects);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        fetchProjects(currentFilter);
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleTechClick = (tech: string) => {
    setSelectedTech(tech);
    handleSearch({ text: '', techs: [tech] });
  };

  const EmptyState = ({ type }: { type: 'all' | 'my' }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-secondary/50 p-4 rounded-full mb-4">
        {type === 'my' ? (
          <FolderPlus className="h-8 w-8 text-primary" />
        ) : (
          <SearchIcon className="h-8 w-8 text-primary" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {type === 'my' 
          ? "You haven't created any projects yet" 
          : "No projects available"}
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        {type === 'my' 
          ? "Start by creating your first project and connect with other developers." 
          : "Be the first to create a project and start collaborating with others."}
      </p>
      {session && (
        <CreateProjectDialog 
          onProjectCreated={() => fetchProjects(currentFilter)} 
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={currentFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setCurrentFilter('all')}
            className="rounded-full"
          >
            All Projects
          </Button>
          <Button
            variant={currentFilter === 'my' ? 'default' : 'outline'}
            onClick={() => setCurrentFilter('my')}
            className="rounded-full"
          >
            My Projects
          </Button>
        </div>
      </div>

      <SearchBar 
        onSearch={handleSearch} 
        projectSkills={allProjectSkills} 
      />
      
      {filteredProjects.length === 0 ? (
        <EmptyState type={currentFilter} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project}
              isOwner={session?.user?.email === project.owner.email}
              onDelete={handleDeleteProject}
              onUpdate={() => fetchProjects(currentFilter)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Separate ProjectCard component for better organization
function ProjectCard({ 
  project, 
  isOwner, 
  onDelete, 
  onUpdate 
}: { 
  project: Project; 
  isOwner: boolean;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}) {
  return (
    <Card className="hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 bg-secondary/50 flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={project.owner.image} alt={project.owner.name} />
          <AvatarFallback>{project.owner.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-foreground">
            {project.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            by {project.owner.name}
          </p>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <EditProjectDialog project={project} onProjectUpdated={onUpdate} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this project? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(project._id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col h-full">
        <p className="text-sm text-muted-foreground mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.requiredSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary/80 hover:bg-secondary transition-colors cursor-pointer"
              onClick={() => handleTechClick(skill)}
            >
              <TechIcon name={skill} className="h-4 w-4" showBackground />
              <span>{skill}</span>
            </Badge>
          ))}
        </div>

        {project.githubUrl ? (
          <a 
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 group"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#161B22] hover:bg-[#1F2428] border border-[#30363D] hover:border-[#6E7681] transition-all">
              <div className="flex items-center gap-2 flex-1">
                <div className="p-1.5 rounded-md bg-white/5">
                  <Github className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">Repository</span>
                  <span className="text-xs text-gray-400">
                    {project.githubUrl.replace('https://github.com/', '')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="flex items-center gap-1 text-xs">
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>main</span>
                </div>
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>
          </a>
        ) : (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-secondary/30 border border-secondary">
            <Link2Off className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Repository not linked</span>
          </div>
        )}

        {/* Push the footer to the bottom */}
        <div className="mt-auto space-y-4">
          <div className="pt-4 border-t border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className={`border-primary/50 ${
                  project.stage === 'OPEN' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {project.stage}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(project.createdAt)}
              </span>
            </div>
            
            <Link 
              href={`/projects/${project._id}`}
              className="block w-full"
            >
              <Button 
                variant="outline" 
                className="w-full group hover:bg-primary hover:text-white border-primary/20 hover:border-primary transition-all duration-300"
              >
                View Details
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
