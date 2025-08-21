import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    
    const connection = await dbConnect();
    console.log('Connection successful:', connection.connection.readyState);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: connection.connection.name,
      readyState: connection.connection.readyState
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
