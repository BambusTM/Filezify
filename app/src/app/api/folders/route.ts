import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import File from '@/models/File';
import { createFolder, deleteFile } from '@/lib/storage';

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

export async function DELETE(request: NextRequest) {
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

        // Connect to database
        await connectToDatabase();
        
        // Construct the full folder path
        const fullFolderPath = folderPath === '' 
            ? folderName
            : `${folderPath}/${folderName}`;
        
        // Find and delete files with paths that start with the folder path
        const filesToDelete = await File.find({ 
            ownerId: session.user.id,
            path: { $regex: `^${fullFolderPath}/` }
        });
        
        // Delete each file from storage and database
        for (const file of filesToDelete) {
            // Delete from storage
            await deleteFile(session.user.id, file.path);
            // Delete from database
            await File.findByIdAndDelete(file._id);
        }

        return NextResponse.json(
            { message: 'Folder deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Folder deletion error:', error);
        return NextResponse.json(
            { message: 'Error deleting folder' },
            { status: 500 }
        );
    }
}
