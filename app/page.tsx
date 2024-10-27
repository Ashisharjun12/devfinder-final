'use client';

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserNav from "@/components/UserNav";
import { ArrowRight, Code2, Users, Rocket, Sparkles, Globe2, Zap, Shield, GitBranch, MessageSquare, Menu, Plus } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [showAllProjects, setShowAllProjects] = useState(false);

  // Use useCallback for fetchProjects
  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/projects');
      console.log('Response:', response);
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
    console.log('Fetching projects...', session);
    console.log('Projects:', projects);
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
      {/* Modern Mobile-First Navigation */}
      <nav className="border-b border-secondary/20 backdrop-blur-lg bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section - More compact on mobile */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary rounded-xl flex items-center justify-center">
                <Code2 className="text-white h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">DevFinder</h1>
            </div>

            {/* Mobile Menu - Modern Sheet Design */}
            {session && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden fixed top-4 left-4 z-50 h-8 w-8 rounded-full bg-secondary/80"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className="w-[280px] sm:w-[320px] bg-background/95 backdrop-blur-lg border-r border-primary/10"
                >
                  <SheetHeader>
                    <SheetTitle className="text-lg flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 space-y-4">
                    <CreateProjectDialog 
                      trigger={
                        <Button className="w-full justify-start gap-3 text-base h-11 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border-none">
                          <Plus className="h-5 w-5" />
                          Create Project
                        </Button>
                      }
                    />
                    
                    <Button 
                      onClick={handleJoinCommunity}
                      className="w-full justify-start gap-3 text-base h-11 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border-none"
                    >
                      <Users className="h-5 w-5" />
                      Join Community
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Desktop Navigation */}
            <div className="flex items-center gap-4">
              {session && (
                <div className="hidden md:flex items-center gap-4">
                  <Button 
                    onClick={handleJoinCommunity}
                    className="rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center gap-2 px-6 h-10"
                  >
                    <Users className="h-5 w-5" />
                    Join Community
                  </Button>
                  <CreateProjectDialog />
                </div>
              )}
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

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {session ? (
          // Logged in content
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <ProjectFilter 
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
              />
              {filteredProjects.length > 6 && (
                <Button
                  onClick={() => setShowAllProjects(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  View All Projects
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
            <SearchBar onSearch={handleSearch} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAllProjects ? filteredProjects : filteredProjects.slice(0, 6)).map((project) => (
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

            {/* Featured Projects with horizontal scroll on mobile */}
            {projects.length > 0 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-4">Featured Projects</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    Discover our latest projects. Sign in to explore more and start collaborating.
                  </p>
                </div>
                
                {/* Projects Grid - Same for both mobile and desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projects
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3)
                    .map((project) => (
                      <ProjectCard 
                        key={project._id} 
                        project={project}
                        isOwner={false}
                      />
                    ))}
                </div>

                <div className="text-center pt-8">
                  <Link href="/auth/signin">
                    <Button 
                      variant="outline" 
                      className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Sign in to View More Projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-secondary/30 rounded-xl p-8 border border-primary/10">
                {[
                  { label: "Active Projects", value: "50+" },
                  { label: "Developers", value: "2,00+" },
                  { label: "Technologies", value: "100+" },
                  { label: "Collaborations", value: "1,00+" }
                ].map((stat) => (
                  <div key={stat.label} className="text-center space-y-2">
                    <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Join CTA Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="bg-gradient-to-b from-secondary/50 to-transparent p-12 rounded-xl border border-primary/10 text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Start Building?
                </h3>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Join our community of developers and start collaborating on exciting projects today.
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={handleJoinCommunity}
                    className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/20"
                  >
                    Join Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto border-t border-primary/10 bg-secondary/5">
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
                      { label: "GitHub", href: "https://github.com/Ashisharjun12" },
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
          </div>
        )}
      </main>

      {/* Feedback Button - Show for all users */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => {
            window.open('https://forms.gle/rfQ2GSUsBH1CNPJ56', '_blank');
          }}
          className="rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          <span className=" sm:inline">Send Feedback</span>
          
        </Button>
      </div>
    </div>
  );
}
