import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import { uploadFile } from '@/lib/storage';

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

    // Use the storage service to upload the file
    const result = await uploadFile(
      buffer,
      session.user.id,
      file.name,
      file.type,
      folderPath
    );

    // Create file record in database
    const fileRecord = await File.create({
      name: file.name,
      path: result.path, // Store the path returned by the storage service
      url: result.url,   // Store the URL if available (for Vercel Blob)
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