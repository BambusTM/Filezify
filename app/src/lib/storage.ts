import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import { put, del, list, head } from '@vercel/blob';

// Check if we're on Vercel (production)
const isOnVercel = process.env.VERCEL === '1';
const uploadDir = process.env.UPLOAD_DIR || 'uploads';

interface UploadResult {
  path: string;        // The path to store in the database
  url?: string;        // URL for Vercel Blob (only in production)
}

/**
 * Creates a folder structure (only needed for local filesystem)
 * For Vercel Blob, folders are virtual and don't need explicit creation
 * 
 * @param userId - The user ID who owns the folder
 * @param folderPath - The folder path to create
 */
export async function createFolder(userId: string, folderPath: string): Promise<boolean> {
  // Make sure folderPath is normalized
  folderPath = folderPath.replace(/\\/g, '/');
  console.log(`Creating folder: ${folderPath} for user ${userId}`);
  
  if (isOnVercel) {
    // Vercel Blob doesn't need folders to be created explicitly
    // They're implicitly created when files are uploaded with path prefixes
    return true;
  } else {
    // For local filesystem, we need to create the directory
    try {
      const userBaseDir = path.join(process.cwd(), uploadDir, userId);
      if (!fs.existsSync(userBaseDir)) {
        fs.mkdirSync(userBaseDir, { recursive: true });
      }
      
      const targetDir = path.join(userBaseDir, folderPath);
      console.log(`Creating directory: ${targetDir}`);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      return true;
    } catch (error) {
      console.error('Error creating folder:', error);
      return false;
    }
  }
}

/**
 * Uploads a file to either Vercel Blob (in production) or local filesystem (in development)
 * 
 * @param buffer - The file buffer to upload
 * @param userId - The user ID who owns the file
 * @param fileName - The original file name
 * @param fileType - The MIME type of the file
 * @param folderPath - Optional folder path (relative to user's base directory)
 * @returns The upload result with path (and URL in production)
 */
export async function uploadFile(
  buffer: Buffer,
  userId: string,
  fileName: string,
  fileType: string,
  folderPath: string = ''
): Promise<UploadResult> {
  // Normalize folder path to use forward slashes for consistency
  folderPath = folderPath.replace(/\\/g, '/');
  
  // Generate unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const uniqueFileName = `${uniqueSuffix}-${fileName}`;
  
  // Determine relative path (this is what we'll store in the database)
  const relativeFilePath = folderPath ? `${folderPath}/${uniqueFileName}` : uniqueFileName;
  
  if (isOnVercel) {
    // Use Vercel Blob in production
    console.log('Using Vercel Blob for file storage');
    
    // In Vercel, we'll use pattern: {userId}/{relativeFilePath}
    const blobPath = `${userId}/${relativeFilePath}`;
    
    const options = {
      contentType: fileType,
      access: 'public' as const, // Must be 'public' for Vercel Blob
    };
    
    try {
      const blob = await put(blobPath, buffer, options);
      console.log('Successfully uploaded to Vercel Blob:', blob.url);
      
      return {
        path: relativeFilePath, // Store the relative path without userId prefix
        url: blob.url,         // Store the Vercel Blob URL
      };
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      throw error;
    }
  } else {
    // Use local filesystem in development
    console.log('Using local filesystem for file storage');
    
    // Define user's base directory: uploads/<userId>
    const userBaseDir = path.join(process.cwd(), uploadDir, userId);
    if (!fs.existsSync(userBaseDir)) {
      fs.mkdirSync(userBaseDir, { recursive: true });
    }

    // Determine target directory based on folderPath
    const targetDir = folderPath 
      ? path.join(userBaseDir, folderPath) 
      : userBaseDir;
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Full path on local filesystem
    const fullFilePath = path.join(targetDir, uniqueFileName);

    // Save file to disk
    await writeFile(fullFilePath, buffer);

    return {
      path: relativeFilePath, // Store just the relative path
    };
  }
}

/**
 * Get file stream or buffer for download
 * 
 * @param userId - The user ID who owns the file
 * @param filePath - The relative file path as stored in the database
 * @returns Object with file data and metadata
 */
export async function getFileForDownload(
  userId: string,
  filePath: string
): Promise<{
  stream?: fs.ReadStream;
  buffer?: Buffer;
  size: number;
  exists: boolean;
  fullPath?: string;
}> {
  // Normalize file path to use forward slashes for consistency
  filePath = filePath.replace(/\\/g, '/');
  
  if (isOnVercel) {
    // Use Vercel Blob in production
    const blobPath = `${userId}/${filePath}`;
    console.log('Retrieving file from Vercel Blob:', blobPath);
    
    try {
      // Check if the blob exists
      const blob = await head(blobPath);
      
      if (!blob) {
        console.error('Blob not found:', blobPath);
        return { exists: false, size: 0 };
      }
      
      // For Vercel Blob, we return the buffer directly
      try {
        console.log('Fetching blob content from URL:', blob.url);
        const response = await fetch(blob.url);
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        return {
          buffer,
          size: blob.size,
          exists: true,
        };
      } catch (fetchError) {
        console.error('Error fetching blob content:', fetchError);
        throw fetchError;
      }
    } catch (error) {
      console.error('Error retrieving file from Vercel Blob:', error);
      return { exists: false, size: 0 };
    }
  } else {
    // Use local filesystem in development
    const fullFilePath = path.join(process.cwd(), uploadDir, userId, filePath);
    
    if (!fs.existsSync(fullFilePath)) {
      return { exists: false, size: 0 };
    }
    
    const stats = fs.statSync(fullFilePath);
    const fileStream = fs.createReadStream(fullFilePath);
    
    return {
      stream: fileStream,
      size: stats.size,
      exists: true,
      fullPath: fullFilePath,
    };
  }
}

/**
 * Delete a file from either Vercel Blob or local filesystem
 * 
 * @param userId - The user ID who owns the file
 * @param filePath - The relative file path as stored in the database
 * @returns Success status
 */
export async function deleteFile(
  userId: string,
  filePath: string
): Promise<boolean> {
  // Normalize file path to use forward slashes for consistency
  filePath = filePath.replace(/\\/g, '/');
  
  if (isOnVercel) {
    // Use Vercel Blob in production
    const blobPath = `${userId}/${filePath}`;
    
    try {
      await del(blobPath);
      return true;
    } catch (error) {
      console.error('Error deleting file from Vercel Blob:', error);
      return false;
    }
  } else {
    // Use local filesystem in development
    const fullFilePath = path.join(process.cwd(), uploadDir, userId, filePath);
    
    if (!fs.existsSync(fullFilePath)) {
      return false;
    }
    
    try {
      fs.unlinkSync(fullFilePath);
      return true;
    } catch (error) {
      console.error('Error deleting file from filesystem:', error);
      return false;
    }
  }
}

/**
 * List files in a directory (for both Vercel Blob and local filesystem)
 * 
 * @param userId - The user ID
 * @param directory - Directory to list (optional)
 * @returns List of file paths
 */
export async function listFiles(
  userId: string,
  directory: string = ''
): Promise<string[]> {
  // Normalize directory path to use forward slashes for consistency
  directory = directory.replace(/\\/g, '/');
  
  if (isOnVercel) {
    // Use Vercel Blob in production
    const prefix = directory ? `${userId}/${directory}/` : `${userId}/`;
    
    try {
      const { blobs } = await list({ prefix });
      // Return paths without userId prefix
      return blobs.map(blob => blob.pathname.replace(`${userId}/`, ''));
    } catch (error) {
      console.error('Error listing files from Vercel Blob:', error);
      return [];
    }
  } else {
    // Use local filesystem in development
    const dirPath = directory
      ? path.join(process.cwd(), uploadDir, userId, directory)
      : path.join(process.cwd(), uploadDir, userId);
    
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    
    try {
      const files = listFilesRecursively(dirPath);
      // Convert absolute paths to relative paths
      const basePath = path.join(process.cwd(), uploadDir, userId);
      return files.map(file => path.relative(basePath, file).replace(/\\/g, '/'));
    } catch (error) {
      console.error('Error listing files from filesystem:', error);
      return [];
    }
  }
}

/**
 * Helper function to recursively list files in a directory
 */
function listFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recursively list files in subdirectory
      results = results.concat(listFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  
  return results;
} 