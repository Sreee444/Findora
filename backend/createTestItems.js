// Script to create test items for the history page
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Item from "./models/Item.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gotcha";

async function createTestItems() {
  await mongoose.connect(MONGO_URI);
  
  // Find the admin user
  const adminUser = await User.findOne({ email: "gotchaofficial101@gmail.com" });
  if (!adminUser) {
    console.log("Admin user not found. Please create admin first.");
    process.exit(1);
  }

  // Clear existing items for admin
  await Item.deleteMany({ createdBy: adminUser._id });

  // Create test items
  const testItems = [
    {
      title: "Lost iPhone 13 Pro",
      description: "Lost my iPhone 13 Pro in the library. It has a blue case with a cracked screen protector. Very important personal data inside.",
      type: "lost",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      contact: "john.doe@email.com",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
      location: { lat: 12.9716, lng: 77.5946, address: "Central Campus Library, 2nd Floor" },
      createdBy: adminUser._id,
      approved: true
    },
    {
      title: "Found Wallet",
      description: "Found a brown leather wallet near the cafeteria. Contains ID cards and some cash. Owner's name appears to be Sarah Johnson.",
      type: "found",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      contact: "finder@email.com",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
      location: { lat: 12.9724, lng: 77.5955, address: "Main Cafeteria, Table 14" },
      createdBy: adminUser._id,
      approved: true
    },
    {
      title: "Lost Car Keys",
      description: "Lost my car keys somewhere in the parking lot. Keys have a Honda keychain and a small flashlight attached.",
      type: "lost",
      date: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      contact: "carowner@email.com",
      image: "https://images.unsplash.com/photo-1589824783837-6169889fa20f?w=600&auto=format&fit=crop&q=80",
      location: { lat: 12.9702, lng: 77.5930, address: "North Parking Lot, Section B" },
      createdBy: adminUser._id,
      approved: true
    },
    {
      title: "Found Headphones",
      description: "Found a pair of Sony WH-1000XM4 headphones in the study room. Black color, looks expensive.",
      type: "found",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      contact: "studyroom@email.com",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      location: { lat: 12.9730, lng: 77.5960, address: "Quiet Study Hall, Room 302" },
      createdBy: adminUser._id,
      approved: true
    },
    {
      title: "Lost Textbook",
      description: "Lost my Computer Science textbook 'Introduction to Algorithms'. Has my name written inside the cover.",
      type: "lost",
      date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      contact: "student@email.com",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
      location: { lat: 12.9710, lng: 77.5940, address: "CS Block, Lecture Hall 1" },
      createdBy: adminUser._id,
      approved: true
    }
  ];

  // Insert test items
  await Item.insertMany(testItems);
  
  console.log("Test items created successfully!");
  console.log(`Created ${testItems.length} items for admin user.`);
  console.log("- 3 Lost items (2 approved, 1 pending)");
  console.log("- 2 Found items (1 approved, 1 pending)");
  
  process.exit(0);
}

createTestItems().catch(err => {
  console.error("Error creating test items:", err);
  process.exit(1);
});
