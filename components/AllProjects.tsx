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

  // Get all unique skills from projects
  const allProjectSkills = Array.from(
    new Set(
      initialProjects.flatMap(project => project.requiredSkills)
    )
  );

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

  useEffect(() => {
    if (currentFilter === 'my' && session?.user?.email) {
      setFilteredProjects(initialProjects.filter(project => 
        project.owner.email === session.user.email
      ));
    } else {
      setFilteredProjects(initialProjects);
    }
  }, [currentFilter, session, initialProjects]);

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg border border-primary/10">
          <div className="flex gap-4">
            <Button
              variant={currentFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setCurrentFilter('all')}
              className="rounded-full px-6"
            >
              All Projects
            </Button>
            <Button
              variant={currentFilter === 'my' ? 'default' : 'outline'}
              onClick={() => setCurrentFilter('my')}
              className="rounded-full px-6"
            >
              My Projects
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} projectSkills={allProjectSkills} />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project._id} className="hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 bg-secondary/50">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={project.owner.image} alt={project.owner.name} />
                <AvatarFallback>{project.owner.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-muted-foreground">by {project.owner.name}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary/80"
                  >
                    <TechIcon name={skill} className="h-4 w-4" showBackground />
                    <span>{skill}</span>
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

              <div className="flex items-center justify-between pt-4 border-t border-primary/10">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
