import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import Permission from '@/models/Permission';
import fs from 'fs';
import path from 'path';

export async function GET(
    _request: Request,
    context: { params: Promise<{ id: string }> }
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

    const { id } = await context.params;
    const file = await File.findById(id);
    if (!file) {
      return NextResponse.json(
          { message: 'File not found' },
          { status: 404 }
      );
    }

    // Check permission (read permission or ownership)
    const hasPermission = await Permission.findOne({
      fileId: file._id,
      userId: session.user.id,
      permissionType: 'read',
    });

    if (!hasPermission && file.ownerId.toString() !== session.user.id) {
      return NextResponse.json(
          { message: 'Permission denied' },
          { status: 403 }
      );
    }

    // Reconstruct full file path using stored relative path
    const fullFilePath = path.join(process.cwd(), 'uploads', file.ownerId.toString(), file.path);

    if (!fs.existsSync(fullFilePath)) {
      return NextResponse.json(
          { message: 'File not found on disk' },
          { status: 404 }
      );
    }

    file.downloadCount += 1;
    await file.save();

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