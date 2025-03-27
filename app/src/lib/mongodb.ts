import mongoose from 'mongoose';

// Get environment variables for connection options
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_BASE_URI = process.env.MONGODB_BASE_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

// Check if at least one connection option is available
if (!MONGODB_URI && (!MONGODB_BASE_URI || !MONGODB_DB_NAME)) {
  throw new Error(
    'Please define either MONGODB_URI or both MONGODB_BASE_URI and MONGODB_DB_NAME environment variables'
  );
}

// Determine which connection string to use
let connectionString: string;
let isAtlasConnection = false;

// Prefer MONGODB_URI (Atlas connection) if provided
if (MONGODB_URI) {
  connectionString = MONGODB_URI;
  isAtlasConnection = true;
  console.log('Using MongoDB Atlas connection');
} else {
  // Otherwise, build connection from separate components (local development)
  if (MONGODB_USER && MONGODB_PASSWORD) {
    const baseWithoutProtocol = MONGODB_BASE_URI!.replace('mongodb://', '');
    connectionString = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${baseWithoutProtocol}/${MONGODB_DB_NAME}?authSource=admin`;
  } else {
    connectionString = `${MONGODB_BASE_URI}/${MONGODB_DB_NAME}`;
  }
  console.log('Using local MongoDB development connection');
}

// Track connection state
let isConnected = false;
// Global cached promise of the connection
let dbConnectPromise: Promise<typeof mongoose> | null = null;

async function connectToDatabase() {
  // If already connected, return immediately
  if (isConnected) {
    console.log('Already connected to MongoDB.');
    return;
  }

  // If a connection is in progress, reuse that promise
  if (dbConnectPromise) {
    console.log('Reusing existing dbConnectPromise...');
    await dbConnectPromise;
    console.log('Existing dbConnectPromise resolved.');

    // For Atlas connections, perform an admin ping to confirm a successful connection
    if (isAtlasConnection && mongoose.connection && mongoose.connection.db) {
      try {
        const adminDb = mongoose.connection.db.admin();
        await adminDb.command({ ping: 1 });
        console.log('Pinged MongoDB Atlas successfully.');
      } catch (pingError) {
        console.error('Failed to ping MongoDB Atlas:', pingError);
        throw pingError;
      }
    }

    return;
  }

  try {
    console.log('Connecting to MongoDB...');

    mongoose.connection.on('connecting', () => {
      console.log('MongoDB connecting...');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected!');
      isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
      dbConnectPromise = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
      dbConnectPromise = null;
    });

    // Configure connection options based on connection type
    const opts: mongoose.ConnectOptions = {
      // Allow buffering commands until connection is established
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000,
    };

    // Add SSL/TLS options for Atlas connections
    if (isAtlasConnection) {
      opts.ssl = true;
      opts.tls = true;
      // Allow invalid certs for some development environments
      opts.tlsAllowInvalidCertificates = process.env.NODE_ENV !== 'production';
      opts.serverApi = {
        version: "1",
        strict: true,
        deprecationErrors: true,
      };
    }

    // Create and store the connection promise
    dbConnectPromise = mongoose.connect(connectionString, opts);
    
    // Await the connection
    await dbConnectPromise;

    // For Atlas connections, perform an admin ping to confirm a successful connection
    if (isAtlasConnection && mongoose.connection && mongoose.connection.db) {
      try {
        const adminDb = mongoose.connection.db.admin();
        await adminDb.command({ ping: 1 });
        console.log('Pinged MongoDB Atlas successfully.');
      } catch (pingError) {
        console.error('Failed to ping MongoDB Atlas:', pingError);
        throw pingError;
      }
    }

    console.log('MongoDB connection established successfully.');
    
    return;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    dbConnectPromise = null;
    throw error;
  }
}

// Health check function to verify database connection
async function checkDatabaseConnection() {
  try {
    // Check if already connected
    if (!isConnected) {
      await connectToDatabase();
    }
    
    // Verify connection is actually alive
    return mongoose.connection.readyState === 1;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}

export { checkDatabaseConnection };
export default connectToDatabase;