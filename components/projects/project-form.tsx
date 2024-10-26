'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { createProject, updateProject } from '@/lib/actions/project.actions'
import { toast } from 'sonner'
import { PROJECT_UPDATED_EVENT } from './project-list'

export function ProjectForm({ project }: { project?: any }) {
  const router = useRouter()
  const { handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: project || {}
  })

  const onSubmit = async (data: any) => {
    try {
      if (project) {
        await updateProject({ id: project.id, ...data })
        toast.success('Project updated successfully')
      } else {
        await createProject(data)
        toast.success('Project created successfully')
      }
      
      // Dispatch custom event for project update
      window.dispatchEvent(new Event(PROJECT_UPDATED_EVENT));
      router.push('/projects')
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Your form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Project'}
      </Button>
    </form>
  )
}
