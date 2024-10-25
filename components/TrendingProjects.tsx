'use client';

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const projects = [
  {
    id: 1,
    title: "AI-Powered Code Assistant",
    description: "Building an intelligent coding assistant using machine learning",
    skills: ["Python", "TensorFlow", "NLP"],
    status: "In Progress",
  },
  {
    id: 2,
    title: "Decentralized Marketplace",
    description: "Creating a blockchain-based marketplace for digital assets",
    skills: ["Solidity", "React", "Web3.js"],
    status: "Looking for Contributors",
  },
  {
    id: 3,
    title: "Real-time Collaboration Tool",
    description: "Developing a real-time document collaboration platform",
    skills: ["Node.js", "Socket.io", "MongoDB"],
    status: "In Progress",
  },
  // Add more projects as needed
];

export default function TrendingProjects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              {project.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-secondary text-primary"
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="border-primary text-primary"
              >
                {project.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
