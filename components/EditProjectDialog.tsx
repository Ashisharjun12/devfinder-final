'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TechIcon, techList } from "./ui/tech-icon";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";

interface Project {
  _id: string; // Change id to _id to match MongoDB
  title: string;
  description: string;
  requiredSkills: string[];
  githubUrl?: string;
  stage: string;
}

interface EditProjectDialogProps {
  project: Project;
  onProjectUpdated?: () => void;
}

export function EditProjectDialog({ project, onProjectUpdated }: EditProjectDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [githubUrl, setGithubUrl] = useState(project.githubUrl || '');
  const [searchTech, setSearchTech] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>(project.requiredSkills);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          githubUrl: githubUrl.trim(),
          requiredSkills: selectedTech,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Project updated successfully.",
        });
        setOpen(false);
        onProjectUpdated?.();
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTech = techList.filter(tech => 
    tech.toLowerCase().includes(searchTech.toLowerCase()) &&
    !selectedTech.includes(tech)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-secondary/95 backdrop-blur-lg border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Form fields similar to CreateProjectDialog */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub Repository URL</label>
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="bg-background/50"
              placeholder="https://github.com/username/repository"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Technologies</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTech.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <TechIcon name={tech} className="h-4 w-4" showBackground />
                  <span className="ml-1">{tech}</span>
                  <X
                    className="ml-2 h-3 w-3 cursor-pointer hover:text-primary-hover"
                    onClick={() => setSelectedTech(prev => prev.filter(t => t !== tech))}
                  />
                </Badge>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Add technologies..."
                value={searchTech}
                onChange={(e) => setSearchTech(e.target.value)}
                className="pl-8 bg-background/50"
              />
            </div>
            {searchTech && filteredTech.length > 0 && (
              <div className="mt-2 max-h-32 overflow-y-auto bg-background/50 rounded-md p-2">
                {filteredTech.map((tech) => (
                  <div
                    key={tech}
                    className="px-3 py-2 hover:bg-primary/20 rounded-md cursor-pointer transition-colors flex items-center gap-2"
                    onClick={() => {
                      setSelectedTech(prev => [...prev, tech]);
                      setSearchTech('');
                    }}
                  >
                    <TechIcon name={tech} className="h-4 w-4" showBackground />
                    {tech}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-primary hover:bg-primary-hover"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
