import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';
import { Types } from 'mongoose';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const project = await Project.findById(params.id);
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    // Check if the user is the owner
    if (project.owner.toString() !== user._id.toString()) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Delete project
    await Project.findByIdAndDelete(params.id);

    // Remove project from user's projects
    await User.findByIdAndUpdate(user._id, {
      $pull: { projects: params.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const project = await Project.findById(params.id);
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    // Check if the user is the owner
    if (project.owner.toString() !== user._id.toString()) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('owner', 'name image email');

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Failed to update project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !Types.ObjectId.isValid(params.id)) {
      return new NextResponse('Invalid project ID', { status: 400 });
    }

    await connectDB();

    const project = await Project.findById(params.id)
      .populate('owner', 'name image email')
      .populate('members.user', 'name image email')
      .lean();

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    // Convert _id to string for serialization
    const serializedProject = {
      ...project,
      _id: project._id.toString(),
      owner: {
        ...project.owner,
        _id: project.owner._id.toString()
      },
      members: project.members.map(member => ({
        ...member,
        _id: member._id.toString(),
        user: {
          ...member.user,
          _id: member.user._id.toString()
        }
      }))
    };

    return NextResponse.json(serializedProject);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
