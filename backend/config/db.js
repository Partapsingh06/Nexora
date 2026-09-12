const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const primaryURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexora';

  try {
    const conn = await mongoose.connect(primaryURI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning]: Unable to connect to primary URI (${primaryURI}): ${error.message}`);

    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[MongoDB]: Initializing in-memory MongoDB instance for local execution...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        if (!mongodInstance) {
          mongodInstance = await MongoMemoryServer.create();
        }
        const memoryURI = mongodInstance.getUri();

        const conn = await mongoose.connect(memoryURI);
        console.log(`[MongoDB Connected]: In-Memory MongoDB running at ${memoryURI}`);
        return conn;
      } catch (memError) {
        console.error(`[MongoDB In-Memory Error]: ${memError.message}`);
      }
    }

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
