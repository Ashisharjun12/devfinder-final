import connectDB from '@/lib/db/init';
import mongoose from 'mongoose';
import md5 from 'md5';

// Define Project Schema
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  requiredSkills: [String],
  githubUrl: String,
  stage: String,
  owner: {
    name: { type: String, default: 'Anonymous' },
    email: String,
    image: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Add a virtual for fallback image
projectSchema.virtual('owner.avatarUrl').get(function() {
  if (this.owner?.image) return this.owner.image;
  if (this.owner?.email) return `https://www.gravatar.com/avatar/${md5(this.owner.email)}?d=mp`;
  return null;
});

// Get Project Model
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export async function getProjects() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function createProject(data: any) {
  try {
    await connectDB();
    
    // Ensure owner data is properly formatted
    const ownerData = {
      name: data.owner.name || 'Anonymous',
      email: data.owner.email,
      image: data.owner.image || null
    };

    const project = await Project.create({
      ...data,
      owner: ownerData
    });
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
}

export async function updateProject(id: string, data: any) {
  try {
    await connectDB();
    const project = await Project.findByIdAndUpdate(
      id,
      { 
        ...data,
        'owner.image': data.owner.image || `https://www.gravatar.com/avatar/${data.owner.email}?d=mp`,
        updatedAt: new Date() 
      },
      { new: true }
    );
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error('Failed to update project:', error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    await connectDB();
    const project = await Project.findByIdAndDelete(id);
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw error;
  }
}
