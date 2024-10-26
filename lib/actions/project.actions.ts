import { projectCache } from '@/lib/utils/cache';
import { db } from '@/lib/db';

interface ProjectQuery {
  userId?: string;
  status?: string;
  category?: string;
  search?: string;
}

export async function getProjects(query: ProjectQuery = {}) {
  const cacheKey = JSON.stringify(query);
  const cached = projectCache.get(cacheKey);
  if (cached) return cached;

  const filter: any = {};
  if (query.userId) filter.userId = query.userId;
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }

  const projects = await db.collection('projects')
    .find(filter)
    .sort({ updatedAt: -1 })
    .limit(20)
    .toArray();

  projectCache.put(cacheKey, projects);
  return projects;
}

export async function createProject(data: any) {
  const project = await db.collection('projects').insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  projectCache.put('recent', null);
  return project;
}

export async function updateProject(data: any) {
  const { id, ...updateData } = data;
  
  const project = await db.collection('projects').findOneAndUpdate(
    { _id: id },
    { 
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );
  
  projectCache.put('recent', null);
  return project;
}

export async function deleteProject(id: string) {
  await db.collection('projects').deleteOne({ _id: id });
  projectCache.put('recent', null);
}
