'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Search, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TechIcon, techList } from "./ui/tech-icon";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface CreateProjectDialogProps {
  onProjectCreated?: () => void;
}

const CreateProjectDialog = ({ onProjectCreated }: CreateProjectDialogProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [searchTech, setSearchTech] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTitle('');
      setDescription('');
      setGithubUrl('');
      setSearchTech('');
      setSelectedTech([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          githubUrl: githubUrl.trim(),
          requiredSkills: selectedTech,
          stage: 'OPEN',
          whatsappNumber: phone, // Use the phone state directly
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Project created successfully.",
        });
        handleOpenChange(false);
        onProjectCreated?.();
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
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

  const handleAddCustomTech = () => {
    if (searchTech && !selectedTech.includes(searchTech)) {
      setSelectedTech(prev => [...prev, searchTech]);
      setSearchTech('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className="rounded-full bg-primary hover:bg-primary-hover text-white flex items-center gap-2 px-6"
        >
          <Plus className="h-5 w-5" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-secondary/95 backdrop-blur-lg border-primary/20 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            Create New Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Form fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <Input
              placeholder="Enter project name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe your project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 min-h-[120px] focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub Repository URL (Optional)</label>
            <Input
              placeholder="https://github.com/username/repository"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="bg-background/50 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Required Technologies</label>
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
                placeholder="Search or enter technologies..."
                value={searchTech}
                onChange={(e) => setSearchTech(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTech();
                  }
                }}
                className="pl-8 bg-background/50 focus:ring-primary"
              />
              {searchTech && !filteredTech.length && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddCustomTech}
                  className="absolute right-2 top-1 text-primary hover:text-primary-hover"
                >
                  Add Custom
                </Button>
              )}
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

          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp Number</label>
            <div className="phone-input-container">
              <PhoneInput
                country={'in'} // Default to India
                value={phone}
                onChange={(phone) => setPhone('+' + phone)}
                inputClass="!w-full !h-10 !bg-background/50 !text-foreground !border-input"
                containerClass="!w-full"
                buttonClass="!bg-background/50 !border-input"
                dropdownClass="!bg-background !text-foreground"
                searchClass="!bg-background !text-foreground"
                enableSearch={true}
                searchPlaceholder="Search country..."
                inputProps={{
                  required: true,
                  placeholder: 'Enter WhatsApp number'
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This number will be used for WhatsApp communication
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="rounded-full px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-primary hover:bg-primary-hover px-6"
              disabled={!title || !description || selectedTech.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
