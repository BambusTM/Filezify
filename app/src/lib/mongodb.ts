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
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  family: 4, // Use IPv4, skip trying IPv6
};

if (isAtlasConnection) {
  opts.ssl = true;
  opts.tls = true;
  opts.tlsAllowInvalidCertificates = process.env.NODE_ENV !== 'production';
  opts.maxPoolSize = 10;
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
  if (cache.conn && mongoose.connection.readyState === 1) {
    return cache.conn;
  }

  // If no connection promise exists, create one
  if (!cache.promise) {
    // Set up events for better logging
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cache.conn = null;
      cache.promise = null;
    });

    mongoose.connection.on('disconnected', () => {
      cache.conn = null;
      cache.promise = null;
    });
    
    // Create connection with timeout
    const connectWithTimeout = async (): Promise<typeof mongoose> => {
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          reject(new Error('MongoDB connection timeout'));
        }, 25000);
      });
      
      const connPromise = mongoose.connect(connectionString, opts);
      return Promise.race([connPromise, timeoutPromise]);
    };
    
    cache.promise = connectWithTimeout()
      .then((mongooseConnection) => {
        if (isAtlasConnection && mongoose.connection && mongoose.connection.db) {
          return mongoose.connection.db.admin().command({ ping: 1 })
            .then(() => mongooseConnection)
            .catch((pingError) => {
              throw pingError;
            });
        }
        return mongooseConnection;
      });
  }

  try {
    const mongooseConnection = await cache.promise;
    cache.conn = mongooseConnection;
    return mongooseConnection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    cache.promise = null;
    throw err;
  }
}

// Health check function to verify database connection
async function checkDatabaseConnection() {
  try {
    await connectToDatabase();
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
}

export { checkDatabaseConnection };
export default connectToDatabase;