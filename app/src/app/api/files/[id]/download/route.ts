import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import Permission from '@/models/Permission';
import fs from 'fs';

interface DownloadRequestParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: Request,
  { params }: DownloadRequestParams
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

    const file = await File.findById(params.id);

    if (!file) {
      return NextResponse.json(
        { message: 'File not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to download
    const hasPermission = await Permission.findOne({
      file: file._id,
      user: session.user.id,
      type: 'download',
    });

    if (!hasPermission && file.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Permission denied' },
        { status: 403 }
      );
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      return NextResponse.json(
        { message: 'File not found on disk' },
        { status: 404 }
      );
    }

    // Increment download count
    file.downloadCount += 1;
    await file.save();

    // Read file
    const fileStream = fs.createReadStream(file.path);
    const fileSize = fs.statSync(file.path).size;

    // Set response headers
    const headers = new Headers();
    headers.set('Content-Type', file.type);
    headers.set('Content-Length', fileSize.toString());
    headers.set('Content-Disposition', `attachment; filename="${file.name}"`);

    // Return file stream
    return new NextResponse(fileStream as unknown as ReadableStream, {
      headers,
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { message: 'Error downloading file' },
      { status: 500 }
    );
  }
} 