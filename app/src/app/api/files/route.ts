import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import Permission from '@/models/Permission';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get user's own files
    const ownFiles = await File.find({ ownerId: session.user.id });

    // Get files shared with the user
    const sharedPermissions = await Permission.find({ userId: session.user.id });
    const sharedFileIds = sharedPermissions.map(permission => permission.fileId);
    const sharedFiles = await File.find({ _id: { $in: sharedFileIds } });

    // Combine and format the files
    const files = [...ownFiles, ...sharedFiles].map(file => ({
      id: file._id,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: file.uploadedAt,
      downloadCount: file.downloadCount,
      locked: file.locked,
      comment: file.comment,
      isOwner: file.ownerId.toString() === session.user.id,
    }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error('File listing error:', error);
    return NextResponse.json(
      { message: 'Error listing files' },
      { status: 500 }
    );
  }
} 