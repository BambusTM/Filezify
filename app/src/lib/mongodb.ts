import mongoose from 'mongoose';

const MONGODB_BASE_URI = process.env.MONGODB_BASE_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

if (!MONGODB_BASE_URI || !MONGODB_DB_NAME) {
  throw new Error(
      'Please define the MONGODB_BASE_URI and MONGODB_DB_NAME environment variables'
  );
}

let MONGODB_URI: string;

if (MONGODB_USER && MONGODB_PASSWORD) {
  const baseWithoutProtocol = MONGODB_BASE_URI.replace('mongodb://', '');
  MONGODB_URI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${baseWithoutProtocol}/${MONGODB_DB_NAME}?authSource=admin`;
} else {
  MONGODB_URI = `${MONGODB_BASE_URI}/${MONGODB_DB_NAME}`;
}

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

    await mongoose.connect(MONGODB_URI, opts);
    isConnected = true;
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

export default connectToDatabase;