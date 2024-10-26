'use client';

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserNav from "@/components/UserNav";
import { ArrowRight, Code2, Users, Rocket, Sparkles, Globe2, Zap, Shield, GitBranch, MessageSquare } from "lucide-react";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TechIcon } from "@/components/ui/tech-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { SearchBar } from "@/components/SearchBar";
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectFilter } from "@/components/ProjectFilter";
import { motion } from "framer-motion";

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
  const [currentFilter, setCurrentFilter] = useState<'all' | 'my'>('all');
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

  const handleFilterChange = (filter: 'all' | 'my') => {
    setCurrentFilter(filter);
    if (filter === 'my' && session?.user?.email) {
      setFilteredProjects(projects.filter(project => 
        project.owner.email === session.user.email
      ));
    } else {
      setFilteredProjects(projects);
    }
  };

  
    const handleJoinCommunity = () => {
      window.open('https://chat.whatsapp.com/B8aC6Tpt7EJA8ykRdEzK27', '_blank');
    };

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

    // Apply current filter after search
    if (currentFilter === 'my' && session?.user?.email) {
      filtered = filtered.filter(project => project.owner.email === session.user.email);
    }

    setFilteredProjects(filtered);
  }, [projects, currentFilter, session]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          // Logged in content
          <div className="space-y-6">
            <ProjectFilter 
              currentFilter={currentFilter}
              onFilterChange={handleFilterChange}
            />
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
          // Non-logged in content with footer
          <div className="space-y-20">
            {/* Hero Section with Fixed Height and Centered Content */}
            <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center text-center">
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Code2 className="text-white h-12 w-12" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Connect with talented developers and build amazing projects together
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
                  Join our community of developers, share your skills, and collaborate on exciting projects.
                </p>
                <div className="pt-4">
                  <Link href="/auth/signin">
                    <Button 
                      className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/20"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Featured Projects */}
            {projects.length > 0 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-4">Featured Projects</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
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
                <div className="text-center space-y-8 pb-20">
                  <Link href="/auth/signin">
                    <Button 
                      variant="outline" 
                      className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      View All Projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  {/* Stats Section */}
                  <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-secondary/30 rounded-xl p-8 border border-primary/10">
                      {[
                        { label: "Active Projects", value: "50+" },
                        { label: "Developers", value: "2,00+" },
                        { label: "Technologies", value: "100+" },
                        { label: "Collaborations", value: "1,00+" }
                      ].map((stat, index) => (
                        <div key={stat.label} className="text-center space-y-2">
                          <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Join CTA Section */}
                  <div className="bg-gradient-to-b from-secondary/50 to-transparent p-12 rounded-xl border border-primary/10 mt-16">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      Ready to Start Building?
                    </h3>
                    <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                      Join our community of developers and start collaborating on exciting projects today.
                    </p>
                    
                      <Button onClick={handleJoinCommunity}
                        className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/20"
                      >
                        Join Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer - Only show for non-logged in users */}
      {!session && (
        <footer className="mt-auto border-t border-primary/10 bg-secondary/5 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  © 2024 KaleHunt. All rights reserved.
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                {[
                  { label: "Twitter", href: "#" },
                  { label: "GitHub", href: "#" },
                  { label: "Discord", href: "#" }
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Feedback Button - Show for all users */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => {
            window.open('https://forms.gle/rfQ2GSUsBH1CNPJ56', '_blank');
          }}
          className="rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Feedback
        </Button>
      </div>
    </div>
  );
}
