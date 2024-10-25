'use client';

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Badge } from "./ui/badge";
import {
  SiReact, SiNodedotjs, SiTypescript, SiVuedotjs, 
  SiTailwindcss, SiJavascript, SiPython, SiDjango,
  SiPostgresql, SiMongodb, SiDocker, SiGit,
  SiAws, SiFirebase, SiRedux, SiGraphql
} from 'react-icons/si';

const techIcons: { [key: string]: JSX.Element } = {
  'React': <SiReact className="text-[#61DAFB]" />,
  'Node.js': <SiNodedotjs className="text-[#339933]" />,
  'TypeScript': <SiTypescript className="text-[#3178C6]" />,
  'Vue.js': <SiVuedotjs className="text-[#4FC08D]" />,
  'TailwindCSS': <SiTailwindcss className="text-[#06B6D4]" />,
  'JavaScript': <SiJavascript className="text-[#F7DF1E]" />,
  'Python': <SiPython className="text-[#3776AB]" />,
  'Django': <SiDjango className="text-[#092E20]" />,
  'PostgreSQL': <SiPostgresql className="text-[#4169E1]" />,
  'MongoDB': <SiMongodb className="text-[#47A248]" />,
  'Docker': <SiDocker className="text-[#2496ED]" />,
  'Git': <SiGit className="text-[#F05032]" />,
  'AWS': <SiAws className="text-[#232F3E]" />,
  'Firebase': <SiFirebase className="text-[#FFCA28]" />,
  'Redux': <SiRedux className="text-[#764ABC]" />,
  'GraphQL': <SiGraphql className="text-[#E10098]" />,
};

const developers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    experience: "5+ years",
    image: "https://i.pravatar.cc/150?img=1",
    github: "sarahchen",
    availability: "Available for projects",
  },
  {
    id: 2,
    name: "Alex Kumar",
    role: "Frontend Specialist",
    skills: ["Vue.js", "TailwindCSS", "JavaScript", "Firebase"],
    experience: "3+ years",
    image: "https://i.pravatar.cc/150?img=2",
    github: "alexk",
    availability: "Open to collaboration",
  },
  {
    id: 3,
    name: "Maria Garcia",
    role: "Backend Engineer",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    experience: "4+ years",
    image: "https://i.pravatar.cc/150?img=3",
    github: "mariagarcia",
    availability: "Available for consulting",
  },
];

export default function FeaturedDevelopers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {developers.map((developer) => (
        <Card 
          key={developer.id} 
          className="p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer bg-secondary/50"
        >
          <div className="flex items-start space-x-4">
            <HoverCard>
              <HoverCardTrigger>
                <Avatar className="h-12 w-12 ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                  <AvatarImage src={developer.image} alt={developer.name} />
                  <AvatarFallback>{developer.name[0]}</AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={developer.image} />
                    <AvatarFallback>{developer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{developer.name}</h4>
                    <p className="text-sm text-muted-foreground">{developer.experience}</p>
                    <p className="text-sm text-muted-foreground">{developer.availability}</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <div className="space-y-2">
              <div>
                <h3 className="font-medium text-foreground">{developer.name}</h3>
                <p className="text-sm text-muted-foreground">{developer.role}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {developer.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="flex items-center gap-1 bg-secondary/80 hover:bg-secondary transition-colors"
                  >
                    {techIcons[skill]}
                    <span className="ml-1">{skill}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
