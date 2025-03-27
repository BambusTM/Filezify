import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/mongodb';

export async function GET() {
  try {
    // Check database connection
    const isConnected = await checkDatabaseConnection();
    
    return NextResponse.json({ 
      isConnected, 
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check error:', error);
    return NextResponse.json({ 
      isConnected: false, 
      error: 'Database connection error', 
      timestamp: new Date().toISOString() 
    }, { status: 500 });
  }
} 