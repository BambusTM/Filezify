import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

interface FileUploadRequest extends Request {
  formData: () => Promise<FormData>;
}

export async function POST(request: FileUploadRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file to disk
    await writeFile(filepath, buffer);

    // Create file record in database
    const fileRecord = await File.create({
      name: file.name,
      path: filepath,
      size: file.size,
      type: file.type,
      owner: session.user.id,
      uploadedAt: new Date(),
      downloadCount: 0,
      locked: false,
      comment: '',
    });

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: fileRecord,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'Error uploading file' },
      { status: 500 }
    );
  }
} 