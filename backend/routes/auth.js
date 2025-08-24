
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";
import { sendWelcomeEmail } from "../services/emailService.js";

const router = express.Router();

// Get all users (admin only)
router.get('/users', auth, async (req, res) => {
  // Optionally: check if req.user is admin
  const users = await User.find({}, '-password');
  res.json(users);
});

// Delete a user (admin only)
router.delete('/users/:id', auth, async (req, res) => {
  // Optionally: check if req.user is admin
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
});


// Get current user profile
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Update current user profile (email and/or username)
router.put("/me", auth, async (req, res) => {
  const { email, username } = req.body;
  if (email && email.length < 3) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (username && username.length < 3) {
    return res.status(400).json({ error: "Invalid username" });
  }
  if (email) {
    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== req.user.id) {
      return res.status(400).json({ error: "Email already taken" });
    }
  }
  const update = {};
  if (email) update.email = email;
  if (username) update.username = username;
  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, select: "-password" });
  res.json(user);
});

// Change password (with old password)
router.put("/change-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Invalid password" });
  }
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.status(400).json({ error: "Old password is incorrect" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password changed successfully" });
});



// Password reset (simple version: update password by email)
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  const user = await User.findOne({ username: email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password updated successfully' });
});


// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (username && username.length < 3) {
      return res.status(400).json({ error: "Invalid username" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash, username });
    await user.save();
    
    // Send welcome email (don't block registration if email fails)
    try {
      await sendWelcomeEmail(email, username);
      console.log(`Welcome email sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError.message);
      // Don't fail registration if email fails
    }
    
    res.json({ 
      message: "User created successfully", 
      emailSent: true // Indicate that email was attempted
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Login route (accepts email or username)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user && email) {
    // Try username if not found by email
    user = await User.findOne({ username: email });
  }
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET || "mysecret");
  res.json({ token });
});

export default router;