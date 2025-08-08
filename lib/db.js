import { MongoClient } from 'mongodb';

const dbName = process.env.MONGODB_DB || 'uptime_monitor';

let cachedClient = globalThis.__mongoClient;
let cachedDb = globalThis.__mongoDb;

export async function getDb() {
  if (cachedDb) return cachedDb;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Please set it in your environment (e.g., .env.local).');
  }

  const client = cachedClient || new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  if (!cachedClient) {
    await client.connect();
    globalThis.__mongoClient = client;
  }

  const db = client.db(dbName);

  // Ensure indexes exist (safe to call multiple times)
  await Promise.all([
    db.collection('monitors').createIndex({ id: 1 }, { unique: true }),
    db.collection('statusChecks').createIndex({ monitorId: 1, timestamp: -1 }),
  ]);

  globalThis.__mongoDb = db;
  return db;
}


