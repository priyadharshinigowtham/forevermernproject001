import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("DB already connected");
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env file");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log(`DB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    throw error; // Re-throw so app.js knows the connection failed
  }
};

export default connectDB;
