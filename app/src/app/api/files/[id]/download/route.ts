import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import File, { IFile } from '@/models/File';
import Permission from '@/models/Permission';
import { getFileForDownload } from '@/lib/storage';
import mongoose from 'mongoose';

interface ValidationResult {
  status: number;
  message?: string;
  file?: IFile;
}

// Helper function to validate file access
async function validateFileAccess(fileId: string, userId: string): Promise<ValidationResult> {
  await connectToDatabase();

  const file = await File.findById(fileId);
  if (!file) {
    return { 
      status: 404, 
      message: 'File not found' 
    };
  }

  // Check permission (read permission or ownership)
  const hasPermission = await Permission.findOne({
    fileId: file._id,
    userId: userId,
    permissionType: 'read',
  });

  if (!hasPermission && file.ownerId.toString() !== userId) {
    return { 
      status: 403, 
      message: 'Permission denied' 
    };
  }

  return { 
    status: 200, 
    file
  };
}

// Handle HEAD requests for file existence check
export async function HEAD(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').slice(-2)[0]; // Get second-to-last segment
  
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await validateFileAccess(id, session.user.id);
    
    return NextResponse.json(
      { message: result.message || 'File exists' },
      { status: result.status }
    );
  } catch (error) {
    console.error('Error checking file:', error);
    return NextResponse.json(
      { message: 'Error checking file' },
      { status: 500 }
    );
  }
}

// Handle GET requests for file download
export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').slice(-2)[0]; // Get second-to-last segment
  
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await validateFileAccess(id, session.user.id);
    
    if (result.status !== 200) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    const file = result.file!;
    
    // Get file data from storage
    const fileData = await getFileForDownload(
      (file.ownerId as mongoose.Types.ObjectId).toString(),
      file.path
    );
    
    if (!fileData.exists) {
      return NextResponse.json(
        { message: 'File not found in storage' },
        { status: 404 }
      );
    }

    // Increment download count
    file.downloadCount += 1;
    await file.save();

    // Set response headers
    const headers = new Headers();
    headers.set('Content-Type', file.type);
    headers.set('Content-Length', fileData.size.toString());
    headers.set('Content-Disposition', `attachment; filename="${file.name}"`);

    if (fileData.buffer) {
      // When using Vercel Blob, return the buffer
      return new NextResponse(fileData.buffer, { headers });
    } else if (fileData.stream) {
      // When using local filesystem, return the stream
      return new NextResponse(fileData.stream as unknown as ReadableStream, { headers });
    } else {
      return NextResponse.json(
        { message: 'Error retrieving file data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { message: 'Error downloading file' },
      { status: 500 }
    );
  }
}