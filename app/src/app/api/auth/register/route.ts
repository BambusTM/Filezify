import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
          { message: 'Missing required fields' },
          { status: 400 }
      );
    }

    // Ensure database connection is established before any operations
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error during registration:', dbError);
      return NextResponse.json(
          { message: 'Database connection failed. Please try again later.' },
          { status: 503 }
      );
    }

    // Only proceed with database operations after connection is confirmed
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
          { message: 'User with this email already exists' },
          { status: 409 }
      );
    }

    const user = await User.create({ username, email, password });
    const userObject = user.toObject();
    delete userObject.password;

    return NextResponse.json(
        { message: 'User created successfully', user: userObject },
        { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
          { message: error.message },
          { status: 500 }
      );
    }
    return NextResponse.json(
        { message: 'An unknown error occurred during registration' },
        { status: 500 }
    );
  }
}