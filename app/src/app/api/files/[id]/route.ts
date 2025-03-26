import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import fs from 'fs';
import path from 'path';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const fileId = params.id;

    // Find the file in the database
    const file = await File.findById(fileId);
    if (!file) {
      return NextResponse.json(
        { message: 'File not found' },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the file
    if (file.ownerId.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this file' },
        { status: 403 }
      );
    }

    // Define the physical file path
    const filePath = path.join(process.cwd(), 'uploads', session.user.id, file.path);

    // Delete the file from the file system
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the file from the database
    await File.findByIdAndDelete(fileId);

    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { message: 'Error deleting file' },
      { status: 500 }
    );
  }
} 