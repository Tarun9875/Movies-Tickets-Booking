import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/movies";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected (movies database)");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};
