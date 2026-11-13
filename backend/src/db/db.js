
import mongoose from "mongoose";
import "../config/environment.js";

export default async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI must be set in the backend environment.");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(mongoUri);

  console.log("Connected to DB");
}
