import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes (to be created next)
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import notificationRoutes from "./routes/notifications.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Database connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gotcha";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.get("/", (req, res) => {
  res.json({ 
    message: "Gotcha Lost & Found API", 
    status: "running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", uptime: process.uptime() });
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/notifications", notificationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));