import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, ".env") });

const dropProjectsCollection = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("📡 Connecting to MongoDB...");

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // Drop the projects collection
    try {
      await mongoose.connection.db.collection("projects").drop();
      console.log("✅ Projects collection dropped successfully");
    } catch (err) {
      if (err.message.includes("ns not found")) {
        console.log("ℹ️ Projects collection doesn't exist, nothing to drop");
      } else {
        throw err;
      }
    }

    await mongoose.connection.close();
    console.log("✅ Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

dropProjectsCollection();
