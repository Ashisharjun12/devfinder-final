import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';
import { Types } from 'mongoose';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user is the owner
    if (project.owner.toString() === user._id.toString()) {
      return NextResponse.json({ 
        error: 'Cannot send connection request to your own project' 
      }, { status: 400 });
    }

    // Check if user is already a member
    const isMember = project.members.some(
      member => member.user.toString() === user._id.toString()
    );
    if (isMember) {
      return NextResponse.json({ 
        status: 'MEMBER',
        message: 'Already a member of this project' 
      });
    }

    // Check if user already has a pending request
    const existingRequest = project.connectionRequests.find(
      request => request.user.toString() === user._id.toString()
    );
    if (existingRequest) {
      return NextResponse.json({ 
        status: existingRequest.status,
        message: `Request already ${existingRequest.status.toLowerCase()}` 
      });
    }

    const { message } = await request.json();

    // Add connection request
    project.connectionRequests.push({
      user: user._id,
      status: 'PENDING',
      message: message || 'Interested in joining the project',
      createdAt: new Date()
    });

    await project.save();

    return NextResponse.json({ 
      status: 'PENDING',
      message: 'Connection request sent successfully' 
    });

  } catch (error) {
    console.error('Connection request error:', error);
    return NextResponse.json(
      { error: 'Failed to send connection request' }, 
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user is a member
    const member = project.members.find(
      m => m.user.toString() === user._id.toString()
    );
    if (member) {
      return NextResponse.json({ status: 'MEMBER' });
    }

    // Check request status
    const request = project.connectionRequests.find(
      r => r.user.toString() === user._id.toString()
    );

    return NextResponse.json({
      status: request ? request.status : 'NOT_REQUESTED'
    });

  } catch (error) {
    console.error('Get connection status error:', error);
    return NextResponse.json(
      { error: 'Failed to get connection status' }, 
      { status: 500 }
    );
  }
}

// Handle request (accept/reject)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { requestId, action } = await request.json();

    await connectDB();

    const project = await Project.findById(params.id)
      .populate('owner', 'email')
      .populate('connectionRequests.user');

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    // Check if user is project owner
    if (project.owner.email !== session.user.email) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const request = project.connectionRequests.id(requestId);
    if (!request) {
      return new NextResponse('Request not found', { status: 404 });
    }

    if (action === 'ACCEPT') {
      request.status = 'ACCEPTED';
      project.connectedUsers.push({
        user: request.user._id
      });
    } else if (action === 'REJECT') {
      request.status = 'REJECTED';
    }

    await project.save();

    return NextResponse.json({ 
      message: `Request ${action.toLowerCase()}ed successfully` 
    });
  } catch (error) {
    console.error('Failed to handle connection request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
