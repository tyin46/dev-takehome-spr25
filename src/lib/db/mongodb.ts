import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yintry314:2Myybj5zzHS0dUVm@devtakehome.yffx71e.mongodb.net/crisis-corner?retryWrites=true&w=majority';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached: typeof mongoose | null = null;

async function dbConnect() {
  if (cached) {
    return cached;
  }

  try {
    cached = await mongoose.connect(MONGODB_URI);
    return cached;
  } catch (error) {
    cached = null;
    throw error;
  }
}

export default dbConnect;
