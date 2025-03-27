import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import Permission from '@/models/Permission';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
      );
    }

    await connectToDatabase();

    // Get folderPath from query parameters (default to root)
    const url = new URL(request.url);
    const folderPath = url.searchParams.get('folderPath') || '';

    // Define user's base directory
    const userBaseDir = path.join(process.cwd(), 'uploads', session.user.id);
    const targetDir = folderPath ? path.join(userBaseDir, folderPath) : userBaseDir;

    // Read directories from file system
    let folders: string[] = [];
    if (fs.existsSync(targetDir)) {
      const entries = fs.readdirSync(targetDir, { withFileTypes: true });
      folders = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
    }

    // Query files from DB that belong to the user (own files)
    const ownFiles = await File.find({ ownerId: session.user.id });
    // Query files shared with the user
    const sharedPermissions = await Permission.find({ userId: session.user.id });
    const sharedFileIds = sharedPermissions.map(permission => permission.fileId);
    const sharedFiles = await File.find({ _id: { $in: sharedFileIds } });

    const combinedFiles = [...ownFiles, ...sharedFiles];

    // Filter files that are directly in the current folder
    const files = combinedFiles.filter(file => {
      const fileDir = path.dirname(file.path) === '.' ? '' : path.dirname(file.path);
      return fileDir === folderPath;
    }).map(file => ({
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

    return NextResponse.json({ folders, files });
  } catch (error) {
    console.error('File listing error:', error);
    return NextResponse.json(
        { message: 'Error listing files' },
        { status: 500 }
    );
  }
}