import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import { deleteFile } from '@/lib/storage';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').slice(-1)[0]; // Get last segment
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const fileId = id;

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
        { message: 'You do not have permission to access this file' },
        { status: 403 }
      );
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error('File retrieval error:', error);
    return NextResponse.json(
      { message: 'Error retrieving file' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').slice(-1)[0]; // Get last segment
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const fileId = id;

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

    // Delete the file using our storage service
    const deleteSuccess = await deleteFile(
      file.ownerId.toString(),
      file.path
    );

    if (!deleteSuccess) {
      console.warn(`File at path ${file.path} could not be deleted from storage`);
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