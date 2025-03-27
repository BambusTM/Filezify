import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/mongodb';

export const maxDuration = 25; // 25 seconds maximum execution time

export async function GET() {
  try {
    // Set a timeout for the health check
    const timeoutPromise = new Promise((_, reject) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        reject(new Error('Database health check timeout'));
      }, 15000); // 15 second timeout
    });

    // Create a promise for the connection check
    const connectionPromise = checkDatabaseConnection()
      .then(isConnected => ({
        isConnected,
        timestamp: new Date().toISOString()
      }));

    // Race the promises to handle timeout
    const result = await Promise.race([connectionPromise, timeoutPromise]);
    
    // If we get here, connection check succeeded
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database health check error:', error);
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown database connection error';
    
    return NextResponse.json({ 
      isConnected: false, 
      error: errorMessage,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV
    }, { status: 503 }); // 503 Service Unavailable
  }
} 