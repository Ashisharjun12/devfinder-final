'use client';

import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { TechIcon } from "./ui/tech-icon";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDate } from "@/lib/utils";
import { Github, ExternalLink, Link2Off, GitBranch, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProjectDialog } from './EditProjectDialog';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import md5 from 'md5';

interface Owner {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  githubUrl?: string;
  stage: string;
  owner: Owner;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
  isOwner?: boolean;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const getAvatarData = (owner: Owner) => {
  const name = owner.name || 'Anonymous';
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  let imageUrl = owner.image;
  
  // If no image but email exists, use Gravatar
  if (!imageUrl && owner.email) {
    imageUrl = `https://www.gravatar.com/avatar/${md5(owner.email)}?d=mp`;
  }

  return {
    imageUrl,
    initials,
    displayName: name
  };
};

export function ProjectCard({ project, isOwner, onUpdate, onDelete }: ProjectCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const { imageUrl, initials, displayName } = getAvatarData(project.owner);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        onDelete?.(); // Call the callback after successful deletion
        window.location.reload();
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

  const handleProjectUpdate = () => {
    // Call both the onUpdate callback and refresh the router
    onUpdate?.();
    window.location.reload();
    router.refresh();
  };

  return (
    <Card className="hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 bg-secondary/50 flex flex-col">
      <CardHeader className="flex flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-primary/20">
          <AvatarImage src={imageUrl || undefined} alt={displayName} />
          <AvatarFallback delayMs={600}>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm sm:text-base truncate">{project.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">by {displayName}</p>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditProjectDialog 
                project={project}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                }
                onProjectUpdated={handleProjectUpdate}
              />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.requiredSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="text-xs px-2 py-0.5 sm:px-2.5 sm:py-1"
            >
              <TechIcon name={skill} className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
              <span className="truncate max-w-[100px] sm:max-w-[150px]">{skill}</span>
            </Badge>
          ))}
        </div>

        {/* GitHub Repository Link */}
        {project.githubUrl && (
          <a 
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#161B22] hover:bg-[#1F2428] border border-[#30363D] hover:border-[#6E7681] transition-all">
              <div className="p-1.5 rounded-md bg-white/5">
                <Github className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-white truncate">
                  {project.githubUrl.replace('https://github.com/', '')}
                </span>
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
        )}

        {/* Push the footer content to the bottom */}
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
            
            <Link href={`/projects/${project._id}`}>
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
