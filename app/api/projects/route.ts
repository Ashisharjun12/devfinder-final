import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const tech = searchParams.get('tech');
    const owner = searchParams.get('owner');
    
    let mongoQuery: any = {};

    if (query) {
      mongoQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { githubUrl: { $regex: query, $options: 'i' } },
      ];
    }

    if (tech) {
      mongoQuery.requiredSkills = {
        $in: tech.split(',').map(t => new RegExp(t.trim(), 'i'))
      };
    }

    if (owner) {
      const user = await User.findOne({ email: owner });
      if (user) {
        mongoQuery.owner = user._id;
      }
    }
    
    const projects = await Project.find(mongoQuery)
      .populate('owner', 'name image email')
      .populate('collaborators.user', 'name image')
      .sort({ createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }), 
        { status: 401 }
      );
    }

    const { title, description, requiredSkills, stage, githubUrl } = await req.json();

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }), 
        { status: 404 }
      );
    }

    // Create project with properly structured data
    const projectData = {
      owner: user._id,
      title,
      description,
      requiredSkills,
      stage: stage || 'OPEN',
      githubUrl: githubUrl || null,
      collaborators: [{
        user: user._id,
        role: 'OWNER',
        joinedAt: new Date()
      }]
    };

    const project = new Project(projectData);
    await project.save();

    // Add project to user's projects
    await User.findByIdAndUpdate(user._id, {
      $push: { projects: project._id }
    });

    // Populate owner details for the response
    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name image')
      .populate('collaborators.user', 'name image');

    return new NextResponse(
      JSON.stringify(populatedProject), 
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error: any) {
    console.error('Failed to create project:', error);
    return new NextResponse(
      JSON.stringify({ 
        message: error.message || 'Internal Server Error',
        details: error.errors || {} 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}