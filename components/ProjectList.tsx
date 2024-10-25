import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function ProjectList() {
  // TODO: Fetch projects from API
  const projects = [];

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>No projects found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
