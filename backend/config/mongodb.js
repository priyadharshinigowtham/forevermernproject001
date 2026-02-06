import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("DB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("DB Connected");
  } catch (error) {
    console.error("MongoDB error:", error.message);
    // Don't exit process in serverless env
  }
};

export default connectDB;
