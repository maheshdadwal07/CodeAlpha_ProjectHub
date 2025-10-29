import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, ".env") });

const fixProjectsCollection = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("📡 Connecting to MongoDB...");

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;

    // Drop the collection completely
    try {
      await db.collection("projects").drop();
      console.log("✅ Dropped projects collection");
    } catch (err) {
      if (err.message.includes("ns not found")) {
        console.log("ℹ️ Projects collection doesn't exist");
      } else {
        throw err;
      }
    }

    // Create collection without any validators using collMod
    await db.createCollection("projects");
    console.log("✅ Created fresh projects collection");

    // Disable validation completely
    await db.command({
      collMod: "projects",
      validator: {},
      validationLevel: "off",
    });
    console.log("✅ Disabled all validators on projects collection");

    await mongoose.connection.close();
    console.log("✅ Connection closed");
    console.log("\n🎉 Now restart your server and try creating a project!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
};

fixProjectsCollection();
