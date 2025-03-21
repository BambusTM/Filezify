import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { folderName, parentPath } = await request.json();
        if (!folderName) {
            return NextResponse.json(
                { message: 'Folder name is required' },
                { status: 400 }
            );
        }

        // Define user's base directory
        const userBaseDir = path.join(process.cwd(), 'uploads', session.user.id);
        // Determine target directory based on parentPath
        const targetDir = parentPath ? path.join(userBaseDir, parentPath, folderName) : path.join(userBaseDir, folderName);

        if (fs.existsSync(targetDir)) {
            return NextResponse.json(
                { message: 'Folder already exists' },
                { status: 409 }
            );
        }

        fs.mkdirSync(targetDir, { recursive: true });

        return NextResponse.json(
            { message: 'Folder created successfully', folder: folderName },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Folder creation error:', error);
        return NextResponse.json(
            { message: 'Error creating folder' },
            { status: 500 }
        );
    }
}
