'use client'

import { deleteProject } from '@/lib/actions/project.actions'
import { toast } from 'sonner'
import { PROJECT_UPDATED_EVENT } from './project-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MoreVertical, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    status: string
    category: string
    createdAt: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const handleDelete = async () => {
    try {
      await deleteProject(project.id)
      toast.success('Project deleted successfully')
      // Dispatch custom event for project update
      window.dispatchEvent(new Event(PROJECT_UPDATED_EVENT))
    } catch (error) {
      toast.error('Failed to delete project')
      console.error(error)
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold">{project.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{project.category}</Badge>
            <Badge 
              variant={
                project.status === 'completed' ? 'default' : 
                project.status === 'active' ? 'secondary' : 'outline'
              }
            >
              {project.status}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/projects/${project.id}/edit`}>
                Edit Project
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/projects/${project.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
