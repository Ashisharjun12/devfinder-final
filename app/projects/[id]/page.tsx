'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TechIcon } from "@/components/ui/tech-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Calendar, Clock, ArrowLeft, ExternalLink, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import ProjectTimeline from "@/components/ProjectTimeline";
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { WhatsAppButton } from '@/components/WhatsAppButton';

interface Project {
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  githubUrl?: string;
  stage: string;
  whatsappNumber?: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        setError('Failed to load project details');
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id, toast]);

  const handleWhatsAppMessage = () => {
    if (project?.whatsappNumber) {
      const message = encodeURIComponent(`Hi, I'm interested in your project "${project.title}"`);
      window.open(`https://wa.me/${project.whatsappNumber}?text=${message}`, '_blank');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>Project not found</div>;

  const isOwner = session?.user?.email === project.owner.email;

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="border-b border-primary/10 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-6 lg:px-8 py-12"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Owner Card */}
            <motion.div variants={item} className="bg-secondary/50 rounded-lg p-6 space-y-4 border border-primary/10">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                  <AvatarImage src={project.owner.image} alt={project.owner.name} />
                  <AvatarFallback>{project.owner.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{project.owner.name}</h3>
                  <p className="text-sm text-muted-foreground">Project Owner</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-primary/10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Last updated {formatDate(project.updatedAt)}</span>
                </div>
              </div>

              {/* Show WhatsApp button only for non-owners */}
              {!isOwner && project.whatsappNumber && (
                <WhatsAppButton 
                  whatsappNumber={project.whatsappNumber}
                  projectTitle={project.title}
                  projectId={project._id}
                />
              )}
            </motion.div>

            {/* Project Timeline */}
            <motion.div variants={item}>
              <ProjectTimeline 
                currentStage={project.stage} 
                isOwner={isOwner}
                projectId={project._id}
              />
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div variants={item} className="lg:col-span-2 space-y-6">
            <div className="bg-secondary/50 rounded-lg p-8 border border-primary/10">
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                {project.title}
              </h1>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                {project.description}
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-medium mb-3 text-primary">Required Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.requiredSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="flex items-center gap-1.5 px-3 py-2 bg-secondary/80 hover:bg-secondary transition-colors"
                      >
                        <TechIcon name={skill} className="h-4 w-4" showBackground />
                        <span>{skill}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {project.githubUrl && (
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-primary">Repository</h3>
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-[#161B22] hover:bg-[#1F2428] border border-[#30363D] hover:border-[#6E7681] transition-all">
                        <Github className="h-5 w-5 text-white" />
                        <span className="flex-1 text-white font-medium">
                          {project.githubUrl.replace('https://github.com/', '')}
                        </span>
                        <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
