'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

export function ProjectCard({ project }: { project: any }) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleViewDetails = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    router.push(`/projects/${project._id}`)
  }

  return (
    // Your existing card UI
    <Button onClick={handleViewDetails}>
      View Details
    </Button>
    // Rest of your card UI
  )
}
