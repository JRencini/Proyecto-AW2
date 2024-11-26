import mongoose from 'mongoose';
import 'dotenv/config';
import { GridFSBucket } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached;

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: 'HuertaChacra',
      bufferCommands: false,
    });

  const conn = await cached.promise;

  const gfs = new GridFSBucket(conn.connection.db, { bucketName: 'uploads' });

  cached = { conn, gfs };
  return cached;
};
