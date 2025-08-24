// Script to create test notifications
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Notification from "./models/Notification.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gotcha";

async function createTestNotifications() {
  await mongoose.connect(MONGO_URI);
  
  // Find the admin user
  const adminUser = await User.findOne({ email: "gotchaofficial101@gmail.com" });
  if (!adminUser) {
    console.log("Admin user not found. Please create admin first.");
    process.exit(1);
  }

  // Create test notifications
  const testNotifications = [
    {
      userId: adminUser._id,
      title: "Welcome to Gotcha!",
      message: "Thank you for joining Gotcha Lost & Found system. You can now report lost or found items.",
      type: "success"
    },
    {
      userId: adminUser._id,
      title: "System Update",
      message: "The notification system is now active. You'll receive updates about your posted items here.",
      type: "info"
    },
    {
      userId: adminUser._id,
      title: "New Item Posted",
      message: "Someone posted a new found item that might match your lost item description.",
      type: "warning"
    }
  ];

  // Clear existing notifications for admin
  await Notification.deleteMany({ userId: adminUser._id });

  // Insert new test notifications
  await Notification.insertMany(testNotifications);
  
  console.log("Test notifications created successfully!");
  console.log(`Created ${testNotifications.length} notifications for admin user.`);
  
  process.exit(0);
}

createTestNotifications().catch(err => {
  console.error("Error creating test notifications:", err);
  process.exit(1);
});
