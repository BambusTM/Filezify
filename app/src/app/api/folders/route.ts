import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import path from 'path';
import fs from 'fs';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import { createFolder } from '@/lib/storage';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { folderPath } = await request.json();
        
        if (!folderPath) {
            return NextResponse.json(
                { message: 'Folder path is required' },
                { status: 400 }
            );
        }

        // Create folder
        const success = await createFolder(session.user.id, folderPath);
        
        if (!success) {
            return NextResponse.json(
                { message: 'Failed to create folder' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Folder created successfully', path: folderPath },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating folder:', error);
        return NextResponse.json(
            { message: 'Error creating folder' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const url = new URL(request.url);
        const folderPath = url.searchParams.get('path');
        const folderName = url.searchParams.get('name');

        if (folderPath === null || !folderName) {
            return NextResponse.json(
                { message: 'Folder path and name are required' },
                { status: 400 }
            );
        }

        // Define user's base directory
        const userBaseDir = path.join(process.cwd(), 'uploads', session.user.id);
        // Determine target directory
        const targetDir = folderPath === '' 
            ? path.join(userBaseDir, folderName)
            : path.join(userBaseDir, folderPath, folderName);

        if (!fs.existsSync(targetDir)) {
            return NextResponse.json(
                { message: 'Folder not found' },
                { status: 404 }
            );
        }

        // Delete files in the database that are in this folder
        await connectToDatabase();
        const folderPathInDb = folderPath === '' ? folderName : `${folderPath}/${folderName}`;
        
        // Find and delete files with paths that start with the folder path
        const filesToDelete = await File.find({ 
            ownerId: session.user.id,
            path: { $regex: `^${folderPathInDb}/` }
        });
        
        // Delete each file from the database
        for (const file of filesToDelete) {
            await File.findByIdAndDelete(file._id);
        }

        // Remove the directory and all its contents
        fs.rmSync(targetDir, { recursive: true, force: true });

        return NextResponse.json(
            { message: 'Folder deleted successfully' },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Folder deletion error:', error);
        return NextResponse.json(
            { message: 'Error deleting folder' },
            { status: 500 }
        );
    }
}
