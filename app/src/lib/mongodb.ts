import mongoose from 'mongoose';

// Define our cache interface
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Type for global cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Create cache or use existing one
const cache: MongooseCache = globalThis.mongooseCache || {
  conn: null, 
  promise: null,
};

// Only in development, reset cache on file changes
if (process.env.NODE_ENV !== 'production') {
  globalThis.mongooseCache = cache;
}

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

// Configure connection options
const opts: mongoose.ConnectOptions = {
  bufferCommands: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds (increased from 10)
  connectTimeoutMS: 30000, // 30 seconds (increased from 10)
  socketTimeoutMS: 45000, // 45 seconds
  family: 4, // Use IPv4, skip trying IPv6
};

if (isAtlasConnection) {
  opts.ssl = true;
  opts.tls = true;
  // Allow invalid certificates in non-production environments
  opts.tlsAllowInvalidCertificates = process.env.NODE_ENV !== 'production';
  
  // Add retry capability for Atlas connections
  opts.maxPoolSize = 10; // Default is 5
  opts.retryWrites = true;
  opts.retryReads = true;
  
  opts.serverApi = {
    version: "1",
    strict: true,
    deprecationErrors: true,
  };
}

async function connectToDatabase() {
  // Use cached connection if available
  if (cache.conn) {
    if (mongoose.connection.readyState === 1) {
      console.log('Using cached MongoDB connection - connected');
      return cache.conn;
    } else if (mongoose.connection.readyState === 2) {
      console.log('Using cached MongoDB connection - connecting');
      return cache.conn;
    } else {
      console.log('Cached connection is not active, creating new one');
      cache.conn = null;
      cache.promise = null;
    }
  }

  // If no connection promise exists, create one
  if (!cache.promise) {
    console.log('Creating new MongoDB connection promise');
    
    // Set up events for better logging
    mongoose.connection.on('connecting', () => {
      console.log('MongoDB connecting...');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected!');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      // Reset cache on connection error
      cache.conn = null;
      cache.promise = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Reset cache when disconnected
      cache.conn = null;
      cache.promise = null;
    });
    
    // Create connection with timeout
    const connectWithTimeout = async (): Promise<typeof mongoose> => {
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          reject(new Error('MongoDB connection timeout - promise timeout'));
        }, 25000); // 25 second timeout
      });
      
      try {
        const connPromise = mongoose.connect(connectionString, opts);
        return await Promise.race([connPromise, timeoutPromise]);
      } catch (error) {
        console.error('Connection attempt failed:', error);
        throw error;
      }
    };
    
    cache.promise = connectWithTimeout()
      .then((mongooseConnection) => {
        // For Atlas connections, perform an admin ping to confirm connectivity
        if (isAtlasConnection && mongoose.connection && mongoose.connection.db) {
          const pingTimeout = new Promise<never>((_, reject) => {
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
              reject(new Error('MongoDB ping timeout'));
            }, 5000); // 5 second ping timeout
          });
          
          return Promise.race([
            mongoose.connection.db.admin().command({ ping: 1 })
              .then(() => {
                console.log('Pinged MongoDB Atlas successfully.');
                return mongooseConnection;
              }),
            pingTimeout
          ]).catch((pingError) => {
            console.error('Failed to ping MongoDB Atlas:', pingError);
            throw pingError;
          });
        }
        return mongooseConnection;
      });
  }

  try {
    const mongooseConnection = await cache.promise;
    cache.conn = mongooseConnection;
    console.log('MongoDB connection established successfully.');
    return mongooseConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cache.promise = null;
    throw error;
  }
}

// Health check function to verify database connection
async function checkDatabaseConnection() {
  try {
    await connectToDatabase();
    return mongoose.connection.readyState === 1;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

export { checkDatabaseConnection };
export default connectToDatabase;