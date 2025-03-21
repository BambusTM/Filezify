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
    const folderPath = (formData.get('folderPath') as string) || '';
    if (!file) {
      return NextResponse.json(
          { message: 'No file provided' },
          { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define user's base directory: uploads/<userId>
    const userBaseDir = path.join(process.cwd(), 'uploads', session.user.id);
    if (!fs.existsSync(userBaseDir)) {
      fs.mkdirSync(userBaseDir, { recursive: true });
    }

    // Determine target directory based on folderPath
    const targetDir = folderPath ? path.join(userBaseDir, folderPath) : userBaseDir;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const fullFilePath = path.join(targetDir, filename);

    // Save file to disk
    await writeFile(fullFilePath, buffer);

    // Store relative file path in DB (relative to user's base directory)
    const relativeFilePath = folderPath ? path.join(folderPath, filename) : filename;

    // Create file record in database
    const fileRecord = await File.create({
      name: file.name,
      path: relativeFilePath,
      size: file.size,
      type: file.type,
      ownerId: session.user.id,
      uploadedAt: new Date(),
      downloadCount: 0,
      locked: false,
      comment: '',
    });

    return NextResponse.json(
        { message: 'File uploaded successfully', file: fileRecord },
        { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
        { message: 'Error uploading file' },
        { status: 500 }
    );
  }
}