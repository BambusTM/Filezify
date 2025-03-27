import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import { createFolder, uploadFile } from '@/lib/storage';
import * as tar from 'tar';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import { writeFile, mkdir, rm } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadRequest extends Request {
  formData: () => Promise<FormData>;
}

interface UploadedFile {
  name: string;
  path: string;
}

export async function POST(request: FileUploadRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    let targetFolder = (formData.get('folderPath') as string) || '';
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file is a tar.gz
    if (!file.name.endsWith('.tar.gz') && !file.name.endsWith('.tgz')) {
      return NextResponse.json(
        { message: 'File must be a .tar.gz or .tgz archive' },
        { status: 400 }
      );
    }

    // Create temporary directory for extraction
    const tempId = uuidv4();
    const tempDir = path.join(process.cwd(), 'temp', tempId);
    const extractDir = path.join(tempDir, 'extracted');
    await mkdir(extractDir, { recursive: true });

    // Create a Buffer from the uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the tar.gz to a temporary file
    const tarPath = path.join(tempDir, file.name);
    await writeFile(tarPath, buffer);

    // Determine folder name from the archive name
    const archiveName = file.name.replace(/\.(tar\.gz|tgz)$/, '');
    
    // Create target folder path
    if (targetFolder) {
      targetFolder = `${targetFolder}/${archiveName}`;
    } else {
      targetFolder = archiveName;
    }

    // Create the target folder
    await connectToDatabase();
    await createFolder(userId, targetFolder);

    // Extract the tar.gz file
    await tar.extract({
      file: tarPath,
      cwd: extractDir
    });

    const uploadedFiles: UploadedFile[] = [];

    // Function to process files recursively
    async function processFiles(dir: string, currentPath = '') {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Create subfolder
          const folderPath = path.join(currentPath, file).replace(/\\/g, '/');
          const subfolderPath = path.join(targetFolder, folderPath).replace(/\\/g, '/');
          await createFolder(userId, subfolderPath);
          
          // Process files in subfolder recursively
          await processFiles(fullPath, path.join(currentPath, file));
        } else {
          // Upload file
          const folderPathForFile = currentPath 
            ? path.join(targetFolder, currentPath).replace(/\\/g, '/')
            : targetFolder;
            
          // Read file from extracted directory
          const fileBuffer = fs.readFileSync(fullPath);
          
          // Upload file to storage
          const result = await uploadFile(
            fileBuffer,
            userId,
            file,
            getMimeType(file),
            folderPathForFile
          );
          
          // Create file record in database
          await File.create({
            name: file,
            path: result.path,
            url: result.url,
            size: stat.size,
            type: getMimeType(file),
            ownerId: userId,
            uploadedAt: new Date(),
            downloadCount: 0,
            locked: false,
            comment: '',
          });
          
          uploadedFiles.push({
            name: file,
            path: result.path
          });
        }
      }
    }
    
    // Process all extracted files
    await processFiles(extractDir);
    
    // Clean up temporary files
    await rm(tempDir, { recursive: true, force: true });

    return NextResponse.json(
      { 
        message: 'Archive extracted and uploaded successfully', 
        folder: targetFolder,
        files: uploadedFiles
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error extracting archive:', error);
    return NextResponse.json(
      { message: 'Error extracting archive' },
      { status: 500 }
    );
  }
}

// Helper function to determine MIME type based on file extension
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.json': 'application/json',
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.xml': 'application/xml',
    '.zip': 'application/zip',
    '.gz': 'application/gzip',
    '.tar': 'application/x-tar',
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
} 