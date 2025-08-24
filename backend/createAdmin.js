// Script to create a default admin user in the database
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gotcha";

async function createAdmin() {
  await mongoose.connect(MONGO_URI);
  const email = "gotchaofficial101@gmail.com";
  const password = "got@101cha"; // Change this to a secure password
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin user already exists.");
    process.exit(0);
  }
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash });
  await user.save();
  console.log("Default admin user created:", email);
  process.exit(0);
}

createAdmin();
