// Script to create a test user
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gotcha";

async function createTestUser() {
  await mongoose.connect(MONGO_URI);
  const email = "test@example.com";
  const password = "test123"; 
  const username = "testuser";
  
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Test user already exists.");
    process.exit(0);
  }
  
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash, username });
  await user.save();
  console.log("Test user created:", email, "password:", password);
  process.exit(0);
}

createTestUser().catch(console.error);
