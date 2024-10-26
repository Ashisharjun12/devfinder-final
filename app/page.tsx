'use client';

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserNav from "@/components/UserNav";
import FeaturedDevelopers from "@/components/FeaturedDevelopers";
import { ArrowRight, Code2 } from "lucide-react";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import AllProjects from "@/components/AllProjects";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, []);

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
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">Featured Developers</h2>
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-primary/80 rounded-full group"
                >
                  View all 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <FeaturedDevelopers />
            </section>

            <section className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">All Projects</h2>
              </div>
              <AllProjects initialProjects={projects} />
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 space-y-10">
            <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center mb-4">
              <Code2 className="text-white h-12 w-12" />
            </div>
            <h2 className="text-5xl font-bold text-center text-foreground max-w-3xl leading-tight">
              Connect with talented developers and build amazing projects together
            </h2>
            <p className="text-xl text-muted-foreground text-center max-w-xl">
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
        )}
      </main>
    </div>
  );
}
