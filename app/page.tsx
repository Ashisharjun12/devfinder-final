'use client';

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserNav from "@/components/UserNav";
import { ArrowRight, Code2, Users, Rocket, Sparkles, Globe2 } from "lucide-react";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TechIcon } from "@/components/ui/tech-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { SearchBar } from "@/components/SearchBar";
import { ProjectCard } from '@/components/ProjectCard';

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

const features = [
  {
    icon: Users,
    title: "Connect with Developers",
    description: "Find talented developers who share your passion for building amazing projects."
  },
  {
    icon: Rocket,
    title: "Launch Projects",
    description: "Turn your ideas into reality by collaborating with skilled developers worldwide."
  },
  {
    icon: Sparkles,
    title: "Showcase Skills",
    description: "Display your technical expertise and build a strong portfolio of projects."
  },
  {
    icon: Globe2,
    title: "Global Community",
    description: "Join a worldwide community of developers eager to collaborate and innovate."
  }
];

export default function Home() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use useCallback for fetchProjects
  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = useCallback(({ text, techs }: { text: string; techs: string[] }) => {
    let filtered = [...projects];

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

    setFilteredProjects(filtered);
  }, [projects]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-secondary/20 backdrop-blur-lg bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
                <Code2 className="text-white h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">DevFinder</h1>
            </div>
            <div className="flex items-center gap-4">
              {session && <CreateProjectDialog />}
              {session ? (
                <UserNav user={session.user} />
              ) : (
                <Link href="/auth/signin">
                  <Button 
                    variant="outline" 
                    className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 px-6"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {session ? (
          <div className="space-y-8">
            <SearchBar onSearch={handleSearch} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project._id} 
                  project={project}
                  isOwner={session?.user?.email === project.owner.email}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-20">
            {/* Hero Section */}
            <div className="text-center space-y-8">
              <h2 className="text-5xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
                Connect with talented developers and build amazing projects together
              </h2>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                Join our community of developers, share your skills, and collaborate on exciting projects.
              </p>
              <Link href="/auth/signin">
                <Button 
                  className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-secondary/50 p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Featured Projects */}
            {projects.length > 0 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-4">Featured Projects</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Discover exciting projects from our community. Sign in to explore more and start collaborating.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 6).map((project) => (
                    <ProjectCard 
                      key={project._id} 
                      project={project}
                      isOwner={false}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <Link href="/auth/signin">
                    <Button 
                      variant="outline" 
                      className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      View All Projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
