import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:]*@/, ':***@')); // Log URI with password masked

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    console.log('Connecting to MongoDB...');
    
    mongoose.connection.on('connecting', () => {
      console.log('MongoDB connecting...');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected!');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    const opts = {
      bufferCommands: false,
    };

    await mongoose.connect(MONGODB_URI as string, opts);
    isConnected = true;
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

export default connectToDatabase; 