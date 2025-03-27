import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import File, { IFile } from '@/models/File';
import Permission from '@/models/Permission';
import fs from 'fs';
import path from 'path';

interface ValidationResult {
  status: number;
  message?: string;
  file?: IFile;
  fullFilePath?: string;
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

  // Verify file exists on disk
  const fullFilePath = path.join(process.cwd(), 'uploads', file.ownerId.toString(), file.path);
  if (!fs.existsSync(fullFilePath)) {
    return { 
      status: 404, 
      message: 'File not found on disk' 
    };
  }

  return { 
    status: 200, 
    file, 
    fullFilePath 
  };
}

// Handle HEAD requests for file existence check
export async function HEAD(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { message: 'File ID is required' },
        { status: 400 }
      );
    }
    
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
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { message: 'File ID is required' },
        { status: 400 }
      );
    }
    
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
    const fullFilePath = result.fullFilePath!;

    // Increment download count
    file.downloadCount += 1;
    await file.save();

    // Stream the file
    const fileStream = fs.createReadStream(fullFilePath);
    const fileSize = fs.statSync(fullFilePath).size;
    const headers = new Headers();
    headers.set('Content-Type', file.type);
    headers.set('Content-Length', fileSize.toString());
    headers.set('Content-Disposition', `attachment; filename="${file.name}"`);

    return new NextResponse(fileStream as unknown as ReadableStream, { headers });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { message: 'Error downloading file' },
      { status: 500 }
    );
  }
}